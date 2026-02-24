part of 'home_screen.dart';

final Map<String, Uint8List> _inlineImageCache = {};

Widget _buildProductImage({
  required String? url,
  required IconData fallbackIcon,
  BoxFit fit = BoxFit.contain,
}) {
  if (url == null || url.isEmpty) {
    return Icon(fallbackIcon, size: 34);
  }
  if (url.startsWith('data:image')) {
    final cached = _inlineImageCache[url];
    if (cached != null) {
      return Image.memory(
        cached,
        fit: fit,
        filterQuality: FilterQuality.medium,
        gaplessPlayback: true,
      );
    }
    final commaIndex = url.indexOf(',');
    if (commaIndex != -1 && commaIndex + 1 < url.length) {
      final base64Part = url.substring(commaIndex + 1);
      try {
        final bytes = base64Decode(base64Part);
        _inlineImageCache[url] = bytes;
        return Image.memory(
          bytes,
          fit: fit,
          filterQuality: FilterQuality.medium,
          gaplessPlayback: true,
        );
      } catch (_) {
        return Icon(fallbackIcon, size: 34);
      }
    }
    return Icon(fallbackIcon, size: 34);
  }
  return Image.network(
    url,
    fit: fit,
    filterQuality: FilterQuality.medium,
    gaplessPlayback: true,
    errorBuilder: (context, error, stackTrace) {
      return Icon(fallbackIcon, size: 34);
    },
  );
}

class _DiscountBadge extends StatelessWidget {
  final Product product;

  const _DiscountBadge({required this.product});

  double? get _discountPercent {
    final base = product.originalPrice;
    if (base == null || base <= 0) {
      return null;
    }
    if (product.price >= base) {
      return null;
    }
    final diff = base - product.price;
    return (diff / base) * 100;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final discount = _discountPercent;
    final label = discount != null
        ? '${discount.round()}% OFF'
        : 'Limited offer';
    return Text(
      label,
      style: theme.textTheme.labelMedium?.copyWith(
        fontWeight: FontWeight.w700,
        color: Colors.white,
      ),
    );
  }
}

class _DiscountPriceRow extends StatelessWidget {
  final Product product;

  const _DiscountPriceRow({required this.product});

  @override
  Widget build(BuildContext context) {
    final base = product.originalPrice;
    if (base == null || base <= 0 || base <= product.price) {
      return Text(
        '₹${product.price.toStringAsFixed(2)}',
        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
      );
    }
    final discount = ((base - product.price) / base * 100).round();
    return Row(
      children: [
        Text(
          '₹${product.price.toStringAsFixed(2)}',
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
        ),
        const SizedBox(width: 6),
        Text(
          '₹${base.toStringAsFixed(2)}',
          style: TextStyle(
            fontSize: 12,
            decoration: TextDecoration.lineThrough,
            color: Colors.white.withValues(alpha: 0.6),
          ),
        ),
        const SizedBox(width: 4),
        Text(
          '-$discount%',
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: Colors.lightGreenAccent,
          ),
        ),
      ],
    );
  }
}

class _HeroCarousel extends StatefulWidget {
  final List<Product> products;

  const _HeroCarousel({required this.products});

  @override
  State<_HeroCarousel> createState() => _HeroCarouselState();
}

class _HeroCarouselState extends State<_HeroCarousel> {
  late final PageController _controller;

  @override
  void initState() {
    super.initState();
    _controller = PageController(viewportFraction: 0.86);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final items = widget.products.take(5).toList();
    if (items.isEmpty) {
      return const SizedBox.shrink();
    }
    return SizedBox(
      height: 190,
      child: PageView.builder(
        controller: _controller,
        physics: const BouncingScrollPhysics(),
        itemCount: items.length,
        itemBuilder: (context, index) {
          final product = items[index];
          return AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              double page = 0;
              if (_controller.hasClients && _controller.position.hasPixels) {
                page = _controller.page ?? _controller.initialPage.toDouble();
              }
              final distance = (page - index).abs().clamp(0.0, 1.0);
              final scale = 1 - distance * 0.08;
              final offsetY = 12 * distance;
              return Transform.translate(
                offset: Offset(0, offsetY),
                child: Transform.scale(scale: scale, child: child),
              );
            },
            child: GlassContainer(
              width: double.infinity,
              height: 190,
              blur: 20,
              borderRadius: BorderRadius.circular(28),
              padding: const EdgeInsets.all(18),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.white.withAlpha(40),
                  Colors.white.withAlpha(14),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(999),
                          color: Colors.redAccent.withValues(alpha: 0.16),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.bolt_rounded,
                              size: 14,
                              color: Colors.orangeAccent,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Flash offer',
                              style: theme.textTheme.labelSmall?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      _DiscountBadge(product: product),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Expanded(
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                product.name,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 8),
                              _DiscountPriceRow(product: product),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        SizedBox(
                          width: 90,
                          height: 90,
                          child: Stack(
                            children: [
                              Align(
                                alignment: Alignment.bottomCenter,
                                child: Container(
                                  width: 70,
                                  height: 18,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(999),
                                    color: Colors.black.withValues(alpha: 0.25),
                                  ),
                                ),
                              ),
                              Align(
                                alignment: Alignment.center,
                                child: Transform.rotate(
                                  angle: -0.18,
                                  child: Container(
                                    width: 80,
                                    height: 80,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(24),
                                      color: Colors.white.withValues(
                                        alpha: 0.08,
                                      ),
                                    ),
                                    clipBehavior: Clip.antiAlias,
                                    child: _buildProductImage(
                                      url: product.imageUrl,
                                      fit: BoxFit.cover,
                                      fallbackIcon:
                                          Icons.local_grocery_store_rounded,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _CategoryChipsRow extends StatelessWidget {
  final List<Category> categories;
  final String? selectedCategoryId;
  final void Function(String? categoryId) onCategorySelected;

  const _CategoryChipsRow({
    required this.categories,
    required this.selectedCategoryId,
    required this.onCategorySelected,
  });

  @override
  Widget build(BuildContext context) {
    if (categories.isEmpty) {
      return const SizedBox.shrink();
    }
    const featuredNames = <String>[
      'Groceries',
      'Fruits',
      'Dairy',
      'Snacks',
      'Beverages',
      'Personal Care',
    ];
    final normalized = <String, Category>{};
    for (final category in categories) {
      normalized[category.name.toLowerCase()] = category;
    }
    final prioritized = <Category>[];
    final usedIds = <String>{};
    for (final name in featuredNames) {
      final match = normalized[name.toLowerCase()];
      if (match != null && !usedIds.contains(match.id)) {
        prioritized.add(match);
        usedIds.add(match.id);
      }
    }
    for (final category in categories) {
      if (!usedIds.contains(category.id)) {
        prioritized.add(category);
        usedIds.add(category.id);
      }
    }
    return SizedBox(
      height: 56,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: prioritized.length,
        separatorBuilder: (context, index) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final category = prioritized[index];
          final selected = category.id == selectedCategoryId;
          return GestureDetector(
            onTap: () {
              onCategorySelected(selected ? null : category.id);
            },
            child: ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    color: selected
                        ? Colors.white.withValues(alpha: 0.18)
                        : Colors.white.withValues(alpha: 0.08),
                    border: Border.all(
                      color: selected
                          ? const Color(0xFF9AF2C8)
                          : Colors.white.withValues(alpha: 0.24),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.local_grocery_store_outlined,
                        size: 16,
                        color: selected ? const Color(0xFF001814) : null,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        category.name,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: selected ? const Color(0xFF001814) : null,
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
    );
  }
}

class _TrendingProductCard extends StatelessWidget {
  final Product product;
  final int quantity;
  final VoidCallback onAdd;
  final VoidCallback onRemove;
  final VoidCallback onOpenDetail;

  const _TrendingProductCard({
    required this.product,
    required this.quantity,
    required this.onAdd,
    required this.onRemove,
    required this.onOpenDetail,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onOpenDetail,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(26),
          color: Colors.white.withValues(alpha: 0.10),
          border: Border.all(color: Colors.white.withValues(alpha: 0.22)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.45),
              blurRadius: 18,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Stack(
                  children: [
                    Align(
                      alignment: Alignment.topRight,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(999),
                          color: Colors.greenAccent.withValues(alpha: 0.22),
                        ),
                        child: const Text(
                          '20% OFF',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.center,
                      child: Transform.translate(
                        offset: const Offset(0, -4),
                        child: SizedBox(
                          width: double.infinity,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              Container(
                                width: 80,
                                height: 80,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: const RadialGradient(
                                    colors: [
                                      Color(0xFF00FFC6),
                                      Colors.transparent,
                                    ],
                                  ),
                                ),
                              ),
                              Container(
                                width: 90,
                                height: 90,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(24),
                                  color: Colors.white.withValues(alpha: 0.06),
                                ),
                                clipBehavior: Clip.antiAlias,
                                child: _buildProductImage(
                                  url: product.imageUrl,
                                  fit: BoxFit.contain,
                                  fallbackIcon: Icons.shopping_bag_outlined,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Text(
                product.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              if (product.category != null)
                Text(
                  product.category!.name,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.white.withValues(alpha: 0.75),
                  ),
                ),
              const SizedBox(height: 4),
              _DiscountPriceRow(product: product),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      product.stock > 0 ? 'In stock' : 'Out of stock',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.white.withValues(alpha: 0.7),
                      ),
                    ),
                  ),
                  _MiniQuantityControls(
                    quantity: quantity,
                    canAdd: product.stock > 0,
                    onAdd: onAdd,
                    onRemove: onRemove,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MiniQuantityControls extends StatelessWidget {
  final int quantity;
  final bool canAdd;
  final VoidCallback onAdd;
  final VoidCallback onRemove;

  const _MiniQuantityControls({
    required this.quantity,
    required this.canAdd,
    required this.onAdd,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (quantity > 0)
          IconButton(
            onPressed: onRemove,
            iconSize: 20,
            padding: EdgeInsets.zero,
            icon: const Icon(Icons.remove_circle_outline),
          ),
        TweenAnimationBuilder<double>(
          tween: Tween<double>(begin: 1, end: canAdd ? 1.05 : 1),
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
          builder: (context, scale, child) {
            return Transform.scale(scale: scale, child: child);
          },
          child: IconButton(
            onPressed: canAdd ? onAdd : null,
            iconSize: 22,
            padding: EdgeInsets.zero,
            icon: const Icon(Icons.add_circle_rounded),
          ),
        ),
      ],
    );
  }
}

class _BrowseTab extends StatelessWidget {
  final List<Category> categories;
  final List<Product> products;
  final Map<String, int> cart;
  final void Function(Product product) onAdd;
  final void Function(Product product) onRemove;
  final void Function(Product product) onOpenDetail;
  final Future<void> Function()? onRefresh;
  final String? selectedCategoryId;
  final void Function(String? categoryId) onCategorySelected;

  const _BrowseTab({
    required this.categories,
    required this.products,
    required this.cart,
    required this.onAdd,
    required this.onRemove,
    required this.onOpenDetail,
    required this.selectedCategoryId,
    required this.onCategorySelected,
    this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final hasProducts = products.isNotEmpty;
    return RefreshIndicator(
      onRefresh: onRefresh ?? () async {},
      edgeOffset: 0,
      child: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (hasProducts) _HeroCarousel(products: products),
                const SizedBox(height: 24),
                if (categories.isNotEmpty)
                  _CategoryChipsRow(
                    categories: categories,
                    selectedCategoryId: selectedCategoryId,
                    onCategorySelected: onCategorySelected,
                  ),
                if (categories.isNotEmpty) const SizedBox(height: 24),
                Text('Trending products', style: theme.textTheme.titleLarge),
                const SizedBox(height: 12),
              ],
            ),
          ),
          if (!hasProducts)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.only(top: 8),
                child: Text('No products available'),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.only(bottom: 8),
              sliver: SliverGrid(
                delegate: SliverChildBuilderDelegate((context, index) {
                  final product = products[index];
                  final quantity = cart[product.id] ?? 0;
                  return _TrendingProductCard(
                    product: product,
                    quantity: quantity,
                    onAdd: () => onAdd(product),
                    onRemove: () => onRemove(product),
                    onOpenDetail: () => onOpenDetail(product),
                  );
                }, childCount: products.length),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  mainAxisExtent: 220,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
