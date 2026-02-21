import 'dart:io';

import 'package:flutter/foundation.dart';

class Env {
  static const bool useProduction = true;

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
