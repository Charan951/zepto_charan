import 'package:flutter/material.dart';

import 'models.dart' as models;
import 'screens/splash_screen.dart' as splash;
import 'screens/login_screen.dart' as login;
import 'screens/register_screen.dart' as register;
import 'screens/home_screen.dart' as home;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String? _token;
  models.AppUser? _user;

  void _handleLoggedIn(String token, models.AppUser user) {
    setState(() {
      _token = token;
      _user = user;
    });
  }

  void _handleLogout() {
    setState(() {
      _token = null;
      _user = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quick Glow Grocer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00C97B),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      routes: {
        '/': (context) => splash.SplashScreen(
          onTap: () {
            if (_token != null && _user != null) {
              Navigator.of(context).pushReplacementNamed('/home');
            } else {
              Navigator.of(context).pushReplacementNamed('/login');
            }
          },
        ),
        '/login': (context) => login.LoginScreen(
          onLoggedIn: (token, user) {
            _handleLoggedIn(token, user);
            Navigator.of(context).pushReplacementNamed('/home');
          },
        ),
        '/register': (context) => register.RegisterScreen(
          onRegistered: (token, user) {
            _handleLoggedIn(token, user);
            Navigator.of(context).pushReplacementNamed('/home');
          },
        ),
        '/home': (context) => home.HomeScreen(
          token: _token,
          user: _user,
          onLogout: () {
            _handleLogout();
            Navigator.of(context).pushReplacementNamed('/login');
          },
        ),
      },
    );
  }
}
