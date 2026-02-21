import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../config.dart';
import '../models.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;
  final Product initialProduct;
  final List<Product> allProducts;
  final void Function(Product product, int quantity) onAddToCart;

  const ProductDetailScreen({
    super.key,
    required this.productId,
    required this.initialProduct,
    required this.allProducts,
    required this.onAddToCart,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  Product? _product;
  bool _isLoading = false;
  String? _error;
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    _product = widget.initialProduct;
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final response = await http.get(
        Uri.parse('${Env.apiBaseUrl}/products/${widget.productId}'),
      );
      final data =
          jsonDecode(response.body.isEmpty ? '{}' : response.body) as Map;
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final productJson = data['product'];
        if (productJson is Map<String, dynamic>) {
          setState(() {
            _product = Product.fromJson(productJson);
          });
        }
      } else {
        setState(() {
          _error = data['message']?.toString() ?? 'Failed to load product';
        });
      }
    } catch (_) {
      setState(() {
        _error = 'Could not load product';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  List<Product> get _similar {
    final product = _product ?? widget.initialProduct;
    final all = widget.allProducts;
    if (product.name.isEmpty || all.isEmpty) {
      return <Product>[];
    }
    final categoryId = product.category?.id;
    if (categoryId == null || categoryId.isEmpty) {
      return <Product>[];
    }
    final sims = all.where((p) {
      final pCategoryId = p.category?.id;
      return p.id != product.id &&
          pCategoryId != null &&
          pCategoryId.isNotEmpty &&
          pCategoryId == categoryId;
    }).toList();
    if (sims.length > 4) {
      return sims.sublist(0, 4);
    }
    return sims;
  }

  void _openSimilar(Product product) {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => ProductDetailScreen(
          productId: product.id,
          initialProduct: product,
          allProducts: widget.allProducts,
          onAddToCart: widget.onAddToCart,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final product = _product ?? widget.initialProduct;
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Product'),
      ),
      body: _error != null && product.name.isEmpty
          ? Center(child: Text(_error!))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_isLoading) const LinearProgressIndicator(minHeight: 2),
                  const SizedBox(height: 8),
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      color: Colors.white.withValues(alpha: 0.04),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.12),
                      ),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: SizedBox(
                      height: 220,
                      width: double.infinity,
                      child:
                          product.imageUrl != null &&
                                  product.imageUrl!.isNotEmpty
                              ? Image.network(product.imageUrl!, fit: BoxFit.cover)
                              : Container(
                                  alignment: Alignment.center,
                                  child: Text(
                                    product.name.isNotEmpty
                                        ? product.name.characters.first
                                            .toUpperCase()
                                        : '?',
                                    style: const TextStyle(
                                      fontSize: 40,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (product.category != null)
                    Text(
                      product.category!.name,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF9AF2C8),
                      ),
                    ),
                  const SizedBox(height: 4),
                  Text(
                    product.name,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (product.description != null &&
                      product.description!.isNotEmpty)
                    Text(
                      product.description!,
                      style: const TextStyle(fontSize: 14, height: 1.4),
                    ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Price', style: TextStyle(fontSize: 13)),
                          const SizedBox(height: 4),
                          Text(
                            '₹${product.price.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text('Stock', style: TextStyle(fontSize: 13)),
                          const SizedBox(height: 4),
                          Text(
                            product.stock > 0
                                ? '${product.stock} available'
                                : 'Out of stock',
                            style: TextStyle(
                              fontSize: 14,
                              color: product.stock > 0
                                  ? Colors.white.withValues(alpha: 0.8)
                                  : Colors.redAccent,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          color: Colors.white.withValues(alpha: 0.04),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.12),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              iconSize: 20,
                              onPressed: () {
                                setState(() {
                                  if (_quantity > 1) {
                                    _quantity -= 1;
                                  }
                                });
                              },
                              icon: const Icon(Icons.remove),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                              ),
                              child: Text(
                                _quantity.toString(),
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            IconButton(
                              iconSize: 20,
                              onPressed:
                                  product.stock > 0 && _quantity < product.stock
                                      ? () {
                                          setState(() {
                                            _quantity += 1;
                                          });
                                        }
                                      : null,
                              icon: const Icon(Icons.add),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: product.stock > 0
                              ? () {
                                  widget.onAddToCart(product, _quantity);
                                  Navigator.of(context).pop();
                                }
                              : null,
                          icon: const Icon(Icons.shopping_bag_outlined),
                          label: Text(
                            product.stock > 0
                                ? 'Add to cart — ₹${(product.price * _quantity).toStringAsFixed(2)}'
                                : 'Out of stock',
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  if (_similar.isNotEmpty)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Similar products',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          height: 160,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: _similar.length,
                            separatorBuilder: (context, index) =>
                                const SizedBox(width: 12),
                            itemBuilder: (context, index) {
                              final item = _similar[index];
                              return SizedBox(
                                width: 160,
                                child: Card(
                                  child: InkWell(
                                    onTap: () => _openSimilar(item),
                                    child: Padding(
                                      padding: const EdgeInsets.all(10),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item.name,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          if (item.category != null)
                                            Text(
                                              item.category!.name,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: TextStyle(
                                                fontSize: 11,
                                                color: Colors.white.withValues(
                                                  alpha: 0.7,
                                                ),
                                              ),
                                            ),
                                          const Spacer(),
                                          Text(
                                            '₹${item.price.toStringAsFixed(2)}',
                                            style: const TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ),
    );
  }
}
