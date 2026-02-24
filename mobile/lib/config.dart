import 'dart:io';

import 'package:flutter/foundation.dart';

class Env {
  static const bool useProduction = false;

  static String get localBaseUrl {
    const fromEnv = String.fromEnvironment('LOCAL_BASE_URL');
    if (fromEnv.isNotEmpty) return fromEnv;
    if (!kIsWeb && Platform.isAndroid) return 'http://10.0.2.2:5000';
    return 'http://localhost:5000';
  }

  static String get productionBaseUrl {
    return 'https://ecomb.speshwayhrms.com';
  }

  static String get baseUrl {
    return useProduction ? productionBaseUrl : localBaseUrl;
  }

  static String get apiBaseUrl =>
      baseUrl.endsWith('/api') ? baseUrl : '$baseUrl/api';
}

class ApiEndpoints {
  static const String authLogin = '/auth/login';
  static const String authRegister = '/auth/register';

  static const String usersMe = '/users/me';
  static const String usersAdminStats = '/users/admin/stats';

  static const String adminCategories = '/admin/categories';
  static String adminCategory(String id) => '/admin/categories/$id';

  static const String adminProducts = '/admin/products';
  static String adminProduct(String id) => '/admin/products/$id';

  static const String adminOrders = '/admin/orders';
  static String adminOrder(String id) => '/admin/orders/$id';

  static const String ordersCheckout = '/orders/checkout';
  static const String ordersMy = '/orders/my';

  static const String products = '/products';
  static String product(String id) => '/products/$id';

  static const String categories = '/categories';
}
