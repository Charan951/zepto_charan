import 'dart:convert';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:glassmorphic_ui_kit/glassmorphic_ui_kit.dart';
import 'package:http/http.dart' as http;

import '../config.dart';
import '../models.dart';
import 'product_detail_screen.dart';

part 'home_browse_widgets.dart';
part 'home_nav_widgets.dart';

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
  int _tabIndex = 0;
  String _searchQuery = '';

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
        http.get(Uri.parse('$apiBase/categories')),
        http.get(Uri.parse('$apiBase/products')),
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
        Uri.parse('$apiBase/orders/my'),
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

  void _addToCart(Product product) {
    setState(() {
      final current = _cart[product.id] ?? 0;
      if (current < product.stock) {
        _cart[product.id] = current + 1;
      }
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
    if (query.isEmpty) {
      return _products;
    }
    return _products.where((product) {
      final name = product.name.toLowerCase();
      final categoryName = product.category?.name.toLowerCase() ?? '';
      return name.contains(query) || categoryName.contains(query);
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
    final addressController = TextEditingController();
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
        Uri.parse('$apiBase/orders/checkout'),
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
            for (var i = 0; i < quantity; i++) {
              _addToCart(selected);
            }
          },
        ),
      ),
    );
  }

  Widget _buildTabBody() {
    switch (_tabIndex) {
      case 0:
        return KeyedSubtree(
          key: const ValueKey('home_browse'),
          child: _BrowseTab(
            categories: _categories,
            products: _filteredProducts,
            cart: _cart,
            onAdd: _addToCart,
            onRemove: _removeFromCart,
            onOpenDetail: _openProductDetail,
            onRefresh: _loadData,
          ),
        );
      case 1:
        return KeyedSubtree(
          key: const ValueKey('home_categories'),
          child: _CategoriesTab(categories: _categories),
        );
      case 2:
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
                    _LuxuryTopBar(userName: widget.user?.name),
                    const SizedBox(height: 20),
                    if (_tabIndex == 0)
                      _GlowingSearchBar(
                        placeholder: 'Search groceries, fruits, dairy...',
                        onChanged: (value) {
                          setState(() {
                            _searchQuery = value;
                          });
                        },
                      ),
                    if (_tabIndex == 0) const SizedBox(height: 20),
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
                isActive: _tabIndex == 2,
                onTap: () {
                  _changeTab(2);
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

