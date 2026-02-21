import 'package:flutter/foundation.dart';

const bool useProductionApi = false;

const String _localMobileApiBase = 'http://10.0.2.2:5000/api';
const String _localWebApiBase = 'http://localhost:5000/api';
const String _productionApiBase = 'http://ecomb.speshwayhrms.com/api';

final String apiBase = useProductionApi
    ? _productionApiBase
    : (kIsWeb ? _localWebApiBase : _localMobileApiBase);
