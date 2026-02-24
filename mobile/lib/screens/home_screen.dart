import 'dart:convert';
import 'dart:ui';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:glassmorphic_ui_kit/glassmorphic_ui_kit.dart';
import 'package:http/http.dart' as http;

import '../config.dart';
import '../models.dart';
import 'product_detail_screen.dart';

part 'home_browse_widgets.dart';
part 'home_nav_widgets.dart';

enum _AddressPickerAction { currentLocation, manual }

class HomeScreen extends StatefulWidget {
  final String? token;
  final AppUser? user;
  final VoidCallback onLogout;

  const HomeScreen({
    super.key,
    required this.token,
    required this.user,
    required this.onLogout,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Category> _categories = [];
  List<Product> _products = [];
  List<Order> _orders = [];
  final Map<String, int> _cart = {};
  bool _isLoadingData = false;
  bool _isLoadingOrders = false;
  String? _error;
  int _tabIndex = 2;
  String _searchQuery = '';
  String? _selectedCategoryId;
  String? _deliveryAddress;
  bool _isResolvingLocation = false;

  String get _addressLabel {
    final value = _deliveryAddress?.trim();
    if (value != null && value.isNotEmpty) {
      return value;
    }
    return 'Set delivery address';
  }

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoadingData = true;
      _error = null;
    });
    try {
      final responses = await Future.wait([
        http.get(Uri.parse('${Env.apiBaseUrl}/categories')),
        http.get(Uri.parse('${Env.apiBaseUrl}/products')),
      ]);
      final categoriesJson =
          jsonDecode(responses[0].body.isEmpty ? '{}' : responses[0].body)
              as Map;
      final productsJson =
          jsonDecode(responses[1].body.isEmpty ? '{}' : responses[1].body)
              as Map;
      if (responses[0].statusCode >= 200 &&
          responses[0].statusCode < 300 &&
          responses[1].statusCode >= 200 &&
          responses[1].statusCode < 300) {
        final categoriesList = categoriesJson['categories'];
        final productsList = productsJson['products'];
        setState(() {
          _categories = categoriesList is List
              ? categoriesList
                    .whereType<Map<String, dynamic>>()
                    .map(Category.fromJson)
                    .toList()
              : <Category>[];
          _products = productsList is List
              ? productsList
                    .whereType<Map<String, dynamic>>()
                    .map(Product.fromJson)
                    .toList()
              : <Product>[];
        });
      } else {
        setState(() {
          _error =
              categoriesJson['message']?.toString() ??
              productsJson['message']?.toString() ??
              'Failed to load data';
        });
      }
    } catch (_) {
      setState(() {
        _error = 'Could not reach server';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingData = false;
        });
      }
    }
  }

  Future<void> _loadOrders() async {
    if (widget.token == null) {
      setState(() {
        _orders = [];
      });
      return;
    }
    setState(() {
      _isLoadingOrders = true;
    });
    try {
      final response = await http.get(
        Uri.parse('${Env.apiBaseUrl}/orders/my'),
        headers: {'Authorization': 'Bearer ${widget.token}'},
      );
      final data =
          jsonDecode(response.body.isEmpty ? '{}' : response.body) as Map;
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final ordersList = data['orders'];
        setState(() {
          _orders = ordersList is List
              ? ordersList
                    .whereType<Map<String, dynamic>>()
                    .map(Order.fromJson)
                    .toList()
              : <Order>[];
        });
      } else {
        setState(() {
          _error = data['message']?.toString() ?? 'Failed to load orders';
        });
      }
    } catch (_) {
      setState(() {
        _error = 'Could not load orders';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingOrders = false;
        });
      }
    }
  }

  void _changeTab(int index) {
    setState(() {
      _tabIndex = index;
    });
    if (index == 3) {
      _loadOrders();
    }
  }

  void _selectCategory(String? categoryId) {
    setState(() {
      if (_selectedCategoryId == categoryId) {
        _selectedCategoryId = null;
      } else {
        _selectedCategoryId = categoryId;
      }
    });
  }

  void _openCategoryFromTab(Category category) {
    setState(() {
      _searchQuery = '';
      _selectedCategoryId = category.id;
      _tabIndex = 2;
    });
  }

  Future<bool> _ensureLocationPermission() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      return false;
    }
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return false;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      return false;
    }
    return true;
  }

  Future<void> _useCurrentLocation() async {
    if (_isResolvingLocation) {
      return;
    }
    setState(() {
      _isResolvingLocation = true;
    });
    try {
      final hasPermission = await _ensureLocationPermission();
      if (!hasPermission) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Location permission is required to use GPS'),
            ),
          );
        }
        return;
      }
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.best,
      );
      final placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );
      String address;
      if (placemarks.isNotEmpty) {
        final place = placemarks.first;
        final parts = <String?>[
          place.name,
          place.street,
          place.subLocality,
          place.locality,
          place.administrativeArea,
          place.postalCode,
          place.country,
        ];
        final nonEmpty = parts
            .where((part) => part != null && part.trim().isNotEmpty)
            .map((part) => part!.trim())
            .toList();
        if (nonEmpty.isNotEmpty) {
          address = nonEmpty.join(', ');
        } else {
          address =
              '${position.latitude.toStringAsFixed(5)}, ${position.longitude.toStringAsFixed(5)}';
        }
      } else {
        address =
            '${position.latitude.toStringAsFixed(5)}, ${position.longitude.toStringAsFixed(5)}';
      }
      if (!mounted) {
        return;
      }
      setState(() {
        _deliveryAddress = address;
      });
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not get current location')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isResolvingLocation = false;
        });
      }
    }
  }

  Future<void> _enterAddressManually() async {
    final controller = TextEditingController(text: _deliveryAddress ?? '');
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Delivery address'),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(labelText: 'Address'),
            maxLines: 3,
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(false);
              },
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop(true);
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
    if (confirmed != true) {
      return;
    }
    final value = controller.text.trim();
    if (value.isEmpty) {
      return;
    }
    setState(() {
      _deliveryAddress = value;
    });
  }

  Future<void> _chooseAddress() async {
    final action = await showDialog<_AddressPickerAction>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Select delivery location'),
          content: const Text(
            'Use your current GPS location or enter an address manually.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(_AddressPickerAction.manual);
              },
              child: const Text('Enter address'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop(_AddressPickerAction.currentLocation);
              },
              child: const Text('Use current location'),
            ),
          ],
        );
      },
    );
    if (action == null) {
      return;
    }
    if (action == _AddressPickerAction.manual) {
      await _enterAddressManually();
    } else {
      await _useCurrentLocation();
    }
  }

  void _addToCart(Product product, {int quantity = 1}) {
    if (quantity <= 0) return;
    setState(() {
      final current = _cart[product.id] ?? 0;
      final maxAllowed = product.stock;
      if (maxAllowed <= 0) {
        _cart.remove(product.id);
        return;
      }
      final next = current + quantity;
      _cart[product.id] = next <= maxAllowed ? next : maxAllowed;
    });
  }

  void _removeFromCart(Product product) {
    setState(() {
      final current = _cart[product.id] ?? 0;
      if (current > 1) {
        _cart[product.id] = current - 1;
      } else {
        _cart.remove(product.id);
      }
    });
  }

  double get _cartTotal {
    double total = 0;
    for (final entry in _cart.entries) {
      final product = _products.firstWhere(
        (p) => p.id == entry.key,
        orElse: () => Product(id: entry.key, name: '', price: 0, stock: 0),
      );
      total += product.price * entry.value;
    }
    return total;
  }

  int get _cartCount {
    int total = 0;
    for (final quantity in _cart.values) {
      total += quantity;
    }
    return total;
  }

  List<Product> get _filteredProducts {
    final query = _searchQuery.trim().toLowerCase();
    return _products.where((product) {
      final matchesQuery = () {
        if (query.isEmpty) {
          return true;
        }
        final name = product.name.toLowerCase();
        final categoryName = product.category?.name.toLowerCase() ?? '';
        return name.contains(query) || categoryName.contains(query);
      }();
      final matchesCategory = () {
        if (_selectedCategoryId == null) {
          return true;
        }
        final id = product.category?.id;
        return id != null && id == _selectedCategoryId;
      }();
      return matchesQuery && matchesCategory;
    }).toList();
  }

  Future<void> _checkout() async {
    if (_cart.isEmpty) {
      return;
    }
    final nameController = TextEditingController(text: widget.user?.name ?? '');
    final emailController = TextEditingController(
      text: widget.user?.email ?? '',
    );
    final addressController = TextEditingController(
      text: _deliveryAddress ?? '',
    );
    final phoneController = TextEditingController();

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Checkout'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Name'),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(labelText: 'Email'),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: phoneController,
                  decoration: const InputDecoration(labelText: 'Phone'),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: addressController,
                  decoration: const InputDecoration(labelText: 'Address'),
                  maxLines: 3,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(false);
              },
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop(true);
              },
              child: const Text('Place order'),
            ),
          ],
        );
      },
    );

    if (confirmed != true) {
      return;
    }

    try {
      final items = _cart.entries.map((entry) {
        final product = _products.firstWhere(
          (p) => p.id == entry.key,
          orElse: () {
            return Product(id: entry.key, name: '', price: 0, stock: 0);
          },
        );
        return {
          'product': product.id,
          'name': product.name,
          'price': product.price,
          'quantity': entry.value,
        };
      }).toList();

      final response = await http.post(
        Uri.parse('${Env.apiBaseUrl}/orders/checkout'),
        headers: const {'Content-Type': 'application/json'},
        body: jsonEncode({
          'customerName': nameController.text.trim(),
          'customerEmail': emailController.text.trim(),
          'customerPhone': phoneController.text.trim(),
          'address': addressController.text.trim(),
          'items': items,
          'paymentMethod': 'cod',
        }),
      );
      final data =
          jsonDecode(response.body.isEmpty ? '{}' : response.body) as Map;
      if (response.statusCode >= 200 && response.statusCode < 300) {
        setState(() {
          _cart.clear();
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Order placed successfully')),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(data['message']?.toString() ?? 'Checkout failed'),
            ),
          );
        }
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not complete checkout')),
        );
      }
    }
  }

  void _openProductDetail(Product product) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => ProductDetailScreen(
          productId: product.id,
          initialProduct: product,
          allProducts: _products,
          onAddToCart: (selected, quantity) {
            _addToCart(selected, quantity: quantity);
          },
        ),
      ),
    );
  }

  Widget _buildTabBody() {
    switch (_tabIndex) {
      case 0:
        return KeyedSubtree(
          key: const ValueKey('home_categories'),
          child: _CategoriesTab(
            categories: _categories,
            onCategoryTap: _openCategoryFromTab,
          ),
        );
      case 1:
        return KeyedSubtree(
          key: const ValueKey('home_cart'),
          child: _CartTab(
            products: _products,
            cart: _cart,
            total: _cartTotal,
            onAdd: _addToCart,
            onRemove: _removeFromCart,
            onCheckout: _checkout,
          ),
        );
      case 2:
        return KeyedSubtree(
          key: const ValueKey('home_browse'),
          child: _BrowseTab(
            categories: _categories,
            products: _filteredProducts,
            cart: _cart,
            onAdd: _addToCart,
            onRemove: _removeFromCart,
            onOpenDetail: _openProductDetail,
            selectedCategoryId: _selectedCategoryId,
            onCategorySelected: _selectCategory,
            onRefresh: _loadData,
          ),
        );
      case 3:
        return KeyedSubtree(
          key: const ValueKey('home_orders'),
          child: _OrdersTab(
            orders: _orders,
            isLoading: _isLoadingOrders,
            isLoggedIn: widget.token != null,
          ),
        );
      case 4:
      default:
        return KeyedSubtree(
          key: const ValueKey('home_profile'),
          child: _ProfileTab(user: widget.user, onLogout: widget.onLogout),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: Colors.black,
      extendBody: true,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF001814), Color(0xFF004D3A), Color(0xFF00D29A)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Stack(
          children: [
            const _FloatingParticlesLayer(),
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _LuxuryTopBar(
                      userName: widget.user?.name,
                      address: _addressLabel,
                      isResolvingLocation: _isResolvingLocation,
                      onAddressTap: _chooseAddress,
                    ),
                    const SizedBox(height: 20),
                    if (_tabIndex == 2)
                      _GlowingSearchBar(
                        placeholder: 'Search groceries, fruits, dairy...',
                        onChanged: (value) {
                          setState(() {
                            _searchQuery = value;
                          });
                        },
                      ),
                    if (_tabIndex == 2) const SizedBox(height: 20),
                    Expanded(
                      child: _isLoadingData
                          ? const Center(child: CircularProgressIndicator())
                          : _error != null
                          ? Center(child: Text(_error!))
                          : AnimatedSwitcher(
                              duration: const Duration(milliseconds: 260),
                              switchInCurve: Curves.easeOutCubic,
                              switchOutCurve: Curves.easeInCubic,
                              transitionBuilder: (child, animation) {
                                final offsetAnimation = Tween<Offset>(
                                  begin: const Offset(0.08, 0),
                                  end: Offset.zero,
                                ).animate(animation);
                                return FadeTransition(
                                  opacity: animation,
                                  child: SlideTransition(
                                    position: offsetAnimation,
                                    child: child,
                                  ),
                                );
                              },
                              child: _buildTabBody(),
                            ),
                    ),
                    const SizedBox(height: 96),
                  ],
                ),
              ),
            ),
            Positioned(
              right: 32,
              bottom: 120,
              child: _FloatingCartButton(
                itemCount: _cartCount,
                isActive: _tabIndex == 1,
                onTap: () {
                  _changeTab(1);
                },
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 26),
        child: _GlassNavBar(
          currentIndex: _tabIndex,
          onTabSelected: _changeTab,
          activeColor: theme.colorScheme.primary,
        ),
      ),
    );
  }
}
