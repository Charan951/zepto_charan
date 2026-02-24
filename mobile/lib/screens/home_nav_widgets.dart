part of 'home_screen.dart';

class _CategoriesTab extends StatelessWidget {
  final List<Category> categories;
  final void Function(Category category) onCategoryTap;

  const _CategoriesTab({required this.categories, required this.onCategoryTap});

  @override
  Widget build(BuildContext context) {
    if (categories.isEmpty) {
      return const Center(child: Text('No categories available'));
    }
    return GridView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
      physics: const BouncingScrollPhysics(),
      itemCount: categories.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 2.6,
      ),
      itemBuilder: (context, index) {
        final category = categories[index];
        return GestureDetector(
          onTap: () => onCategoryTap(category),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  color: Colors.white.withValues(alpha: 0.1),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.22),
                  ),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                child: Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: [Color(0xFF2AF598), Color(0xFF00E4FF)],
                        ),
                      ),
                      child: const Icon(
                        Icons.local_grocery_store_outlined,
                        size: 18,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        category.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _ProfileTab extends StatelessWidget {
  final AppUser? user;
  final VoidCallback onLogout;

  const _ProfileTab({required this.user, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final name = (user?.name.isNotEmpty ?? false)
        ? user!.name
        : 'Guest shopper';
    final email = user?.email ?? '';
    return Center(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
          child: Container(
            width: 380,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
              color: Colors.white.withValues(alpha: 0.1),
              border: Border.all(color: Colors.white.withValues(alpha: 0.26)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundColor: Colors.white.withValues(alpha: 0.18),
                  child: Text(
                    name.isNotEmpty ? name.characters.first.toUpperCase() : '?',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(name, style: theme.textTheme.titleMedium),
                if (email.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    email,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.white.withValues(alpha: 0.7),
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: onLogout,
                  icon: const Icon(Icons.logout_rounded),
                  label: const Text('Sign out'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _LuxuryTopBar extends StatelessWidget {
  final String? userName;
  final String address;
  final bool isResolvingLocation;
  final VoidCallback onAddressTap;

  const _LuxuryTopBar({
    this.userName,
    required this.address,
    required this.isResolvingLocation,
    required this.onAddressTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final greetingName = (userName != null && userName!.trim().isNotEmpty)
        ? userName!.trim()
        : 'Guest shopper';
    final trailing = isResolvingLocation
        ? const SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(strokeWidth: 2),
          )
        : const Icon(Icons.keyboard_arrow_down_rounded, size: 18);
    return Row(
      children: [
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
              child: GestureDetector(
                onTap: onAddressTap,
                behavior: HitTestBehavior.opaque,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    color: Colors.white.withValues(alpha: 0.08),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.28),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [Color(0xFF2AF598), Color(0xFF00E4FF)],
                          ),
                        ),
                        child: const Icon(
                          Icons.place_outlined,
                          size: 18,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              greetingName,
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: Colors.white.withValues(alpha: 0.8),
                                letterSpacing: 0.3,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    address,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: theme.textTheme.bodyMedium?.copyWith(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 4),
                                trailing,
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                color: Colors.white.withValues(alpha: 0.08),
                border: Border.all(color: Colors.white.withValues(alpha: 0.28)),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const Icon(Icons.notifications_none_rounded, size: 22),
                  Positioned(
                    top: 10,
                    right: 12,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.redAccent,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _GlowingSearchBar extends StatelessWidget {
  final String placeholder;
  final ValueChanged<String> onChanged;

  const _GlowingSearchBar({required this.placeholder, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(32),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          height: 56,
          padding: const EdgeInsets.symmetric(horizontal: 18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(32),
            color: Colors.white.withValues(alpha: 0.08),
            border: Border.all(color: Colors.white.withValues(alpha: 0.22)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.55),
                blurRadius: 32,
                offset: const Offset(0, 20),
              ),
            ],
          ),
          child: Row(
            children: [
              const Icon(Icons.search_rounded, size: 22),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  onChanged: onChanged,
                  style: const TextStyle(fontSize: 14),
                  decoration: InputDecoration(
                    hintText: placeholder,
                    border: InputBorder.none,
                    hintStyle: TextStyle(
                      color: Colors.white.withValues(alpha: 0.7),
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(999),
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2AF598), Color(0xFF00E4FF)],
                  ),
                ),
                child: const Icon(
                  Icons.tune_rounded,
                  size: 18,
                  color: Colors.black,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GlassNavBar extends StatelessWidget {
  final int currentIndex;
  final void Function(int index) onTabSelected;
  final Color activeColor;

  const _GlassNavBar({
    required this.currentIndex,
    required this.onTabSelected,
    required this.activeColor,
  });
  @override
  Widget build(BuildContext context) {
    const items = [
      _NavItemData(Icons.grid_view_rounded, 'Categories'),
      _NavItemData(Icons.shopping_cart_rounded, 'Cart'),
      _NavItemData(Icons.home_rounded, 'Home'),
      _NavItemData(Icons.receipt_long_rounded, 'Orders'),
      _NavItemData(Icons.person_rounded, 'Profile'),
    ];
    return ClipRRect(
      borderRadius: BorderRadius.circular(40),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          height: 78,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(40),
            color: Colors.white.withValues(alpha: 0.08),
            border: Border.all(color: Colors.white.withValues(alpha: 0.26)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(items.length, (index) {
              final item = items[index];
              final selected = index == currentIndex;
              return _GlassNavItem(
                icon: item.icon,
                label: item.label,
                selected: selected,
                activeColor: activeColor,
                onTap: () => onTabSelected(index),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _NavItemData {
  final IconData icon;
  final String label;

  const _NavItemData(this.icon, this.label);
}

class _GlassNavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final Color activeColor;
  final VoidCallback onTap;

  const _GlassNavItem({
    required this.icon,
    required this.label,
    required this.selected,
    required this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = selected ? activeColor : Colors.white.withValues(alpha: 0.8);
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 260),
          curve: Curves.easeOutCubic,
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            color: selected
                ? Colors.white.withValues(alpha: 0.16)
                : Colors.transparent,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TweenAnimationBuilder<double>(
                tween: Tween<double>(begin: 1, end: selected ? 1.1 : 1),
                duration: const Duration(milliseconds: 260),
                curve: Curves.easeOutBack,
                builder: (context, scale, child) {
                  return Transform.scale(scale: scale, child: child);
                },
                child: Icon(icon, size: 22, color: color),
              ),
              const SizedBox(height: 4),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 260),
                curve: Curves.easeOutCubic,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                  color: color,
                ),
                child: Text(label),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FloatingCartButton extends StatelessWidget {
  final int itemCount;
  final bool isActive;
  final VoidCallback onTap;

  const _FloatingCartButton({
    required this.itemCount,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 1, end: isActive ? 1.08 : 1),
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
      builder: (context, scale, child) {
        return Transform.scale(scale: scale, child: child);
      },
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: const LinearGradient(
              colors: [Color(0xFF2AF598), Color(0xFF00E4FF)],
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF2AF598).withValues(alpha: 0.7),
                blurRadius: 26,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              const Icon(
                Icons.shopping_bag_rounded,
                size: 26,
                color: Colors.black,
              ),
              if (itemCount > 0)
                Positioned(
                  top: 10,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.redAccent,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      itemCount.toString(),
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FloatingParticlesLayer extends StatelessWidget {
  const _FloatingParticlesLayer();

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    const baseOffsets = [
      Offset(0.15, 0.2),
      Offset(0.8, 0.25),
      Offset(0.3, 0.6),
      Offset(0.7, 0.7),
      Offset(0.5, 0.4),
    ];
    final dots = <Widget>[];
    for (var i = 0; i < baseOffsets.length; i++) {
      final base = baseOffsets[i];
      final dx = base.dx * size.width;
      final dy = base.dy * size.height;
      dots.add(
        Positioned(
          left: dx,
          top: dy,
          child: Container(
            width: 3.5 + i.toDouble(),
            height: 3.5 + i.toDouble(),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withValues(alpha: 0.24),
              boxShadow: [
                BoxShadow(
                  color: Colors.white.withValues(alpha: 0.22),
                  blurRadius: 12,
                  spreadRadius: 1,
                ),
              ],
            ),
          ),
        ),
      );
    }
    return IgnorePointer(child: Stack(children: dots));
  }
}

class _CartTab extends StatelessWidget {
  final List<Product> products;
  final Map<String, int> cart;
  final double total;
  final void Function(Product product) onAdd;
  final void Function(Product product) onRemove;
  final VoidCallback onCheckout;

  const _CartTab({
    required this.products,
    required this.cart,
    required this.total,
    required this.onAdd,
    required this.onRemove,
    required this.onCheckout,
  });

  @override
  Widget build(BuildContext context) {
    final items = cart.entries.map((entry) {
      final product = products.firstWhere(
        (p) => p.id == entry.key,
        orElse: () {
          return Product(id: entry.key, name: '', price: 0, stock: 0);
        },
      );
      return MapEntry(product, entry.value);
    }).toList();

    return Column(
      children: [
        Expanded(
          child: items.isEmpty
              ? const Center(child: Text('Your cart is empty'))
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  itemCount: items.length,
                  itemBuilder: (context, index) {
                    final product = items[index].key;
                    final quantity = items[index].value;
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        title: Text(product.name),
                        subtitle: Text(
                          '₹${product.price.toStringAsFixed(2)} x $quantity',
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              onPressed: () => onRemove(product),
                              icon: const Icon(Icons.remove_circle_outline),
                            ),
                            Text(quantity.toString()),
                            IconButton(
                              onPressed: () => onAdd(product),
                              icon: const Icon(Icons.add_circle_outline),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.black.withValues(alpha: 0.2),
            border: Border(
              top: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Total', style: TextStyle(fontSize: 13)),
                    const SizedBox(height: 4),
                    Text(
                      '₹${total.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              FilledButton(
                onPressed: items.isEmpty ? null : onCheckout,
                child: const Text('Checkout'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _OrdersTab extends StatelessWidget {
  final List<Order> orders;
  final bool isLoading;
  final bool isLoggedIn;

  const _OrdersTab({
    required this.orders,
    required this.isLoading,
    required this.isLoggedIn,
  });

  @override
  Widget build(BuildContext context) {
    if (!isLoggedIn) {
      return const Center(child: Text('Log in again to view your orders'));
    }
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (orders.isEmpty) {
      return const Center(child: Text('No orders yet'));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Order ${order.id.substring(order.id.length - 6)}',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    Text(
                      '₹${order.totalAmount.toStringAsFixed(2)}',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '${order.status.toUpperCase()} • ${order.paymentStatus.toUpperCase()}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withValues(alpha: 0.7),
                  ),
                ),
                const SizedBox(height: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: order.items
                      .map(
                        (item) => Text(
                          '${item.name} x${item.quantity}',
                          style: const TextStyle(fontSize: 13),
                        ),
                      )
                      .toList(),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
