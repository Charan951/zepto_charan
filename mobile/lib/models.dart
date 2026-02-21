class AppUser {
  final String id;
  final String name;
  final String email;
  final String role;

  AppUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
  });

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      role: json['role']?.toString() ?? 'user',
    );
  }
}

class Category {
  final String id;
  final String name;
  final String? description;
  final String? icon;
  final String? color;

  Category({
    required this.id,
    required this.name,
    this.description,
    this.icon,
    this.color,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['_id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString(),
      icon: json['icon']?.toString(),
      color: json['color']?.toString(),
    );
  }
}

class Product {
  final String id;
  final String name;
  final double price;
  final int stock;
  final String? description;
  final String? imageUrl;
  final Category? category;
  final double? originalPrice;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.stock,
    this.description,
    this.imageUrl,
    this.category,
    this.originalPrice,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    final categoryJson = json['category'];
    Category? category;
    if (categoryJson is Map<String, dynamic>) {
      category = Category(
        id: categoryJson['_id']?.toString() ?? '',
        name: categoryJson['name']?.toString() ?? '',
      );
    }
    return Product(
      id: json['_id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : 0,
      stock: json['stock'] is int ? json['stock'] as int : 0,
      description: json['description']?.toString(),
      imageUrl: json['imageUrl']?.toString(),
      category: category,
      originalPrice: (json['originalPrice'] is num)
          ? (json['originalPrice'] as num).toDouble()
          : null,
    );
  }
}

class OrderItem {
  final String name;
  final int quantity;
  final double price;

  OrderItem({required this.name, required this.quantity, required this.price});

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      name: json['name']?.toString() ?? '',
      quantity: json['quantity'] is int ? json['quantity'] as int : 0,
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : 0,
    );
  }
}

class Order {
  final String id;
  final String customerName;
  final String customerEmail;
  final String? address;
  final double totalAmount;
  final String status;
  final String paymentStatus;
  final List<OrderItem> items;

  Order({
    required this.id,
    required this.customerName,
    required this.customerEmail,
    required this.totalAmount,
    required this.status,
    required this.paymentStatus,
    required this.items,
    this.address,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    final itemsJson = json['items'];
    return Order(
      id: json['_id']?.toString() ?? '',
      customerName: json['customerName']?.toString() ?? '',
      customerEmail: json['customerEmail']?.toString() ?? '',
      address: json['address']?.toString(),
      totalAmount: (json['totalAmount'] is num)
          ? (json['totalAmount'] as num).toDouble()
          : 0,
      status: json['status']?.toString() ?? '',
      paymentStatus: json['paymentStatus']?.toString() ?? '',
      items: itemsJson is List
          ? itemsJson
                .whereType<Map<String, dynamic>>()
                .map(OrderItem.fromJson)
                .toList()
          : <OrderItem>[],
    );
  }
}

