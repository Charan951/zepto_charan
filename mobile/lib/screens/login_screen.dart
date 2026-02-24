import 'dart:convert';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../config.dart';
import '../models.dart';

class LoginScreen extends StatefulWidget {
  final void Function(String token, AppUser user) onLoggedIn;

  const LoginScreen({super.key, required this.onLoggedIn});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _error;
  bool _obscurePassword = true;
  late final AnimationController _cardController;
  late final Animation<double> _cardGlow;
  late final Animation<double> _cardScale;

  @override
  void initState() {
    super.initState();
    _cardController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);
    final curve = CurvedAnimation(
      parent: _cardController,
      curve: Curves.easeInOut,
    );
    _cardGlow = Tween<double>(begin: 0.5, end: 1).animate(curve);
    _cardScale = Tween<double>(begin: 0.97, end: 1.04).animate(curve);
  }

  @override
  void dispose() {
    _cardController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final response = await http.post(
        Uri.parse('${Env.apiBaseUrl}/auth/login'),
        headers: const {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _emailController.text.trim(),
          'password': _passwordController.text,
        }),
      );
      final data =
          jsonDecode(response.body.isEmpty ? '{}' : response.body) as Map;
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final token = data['token']?.toString();
        final userJson = data['user'];
        if (token == null || userJson is! Map) {
          setState(() {
            _error = 'Invalid server response';
          });
        } else {
          final user = AppUser.fromJson(userJson.cast<String, dynamic>());
          widget.onLoggedIn(token, user);
        }
      } else {
        setState(() {
          _error = data['message']?.toString() ?? 'Login failed';
        });
      }
    } catch (_) {
      setState(() {
        _error = 'Could not reach server';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF00110B), Color(0xFF005F3A), Color(0xFF00E58F)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0.9, end: 1),
                  duration: const Duration(milliseconds: 820),
                  curve: Curves.easeOutCubic,
                  builder: (context, value, child) {
                    return Transform.scale(
                      scale: value,
                      child: Opacity(opacity: value.clamp(0, 1), child: child),
                    );
                  },
                  child: AnimatedBuilder(
                    animation: _cardController,
                    builder: (context, child) {
                      final glow = _cardGlow.value;
                      final scale = _cardScale.value;
                      return Transform.scale(
                        scale: scale,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(28),
                          child: BackdropFilter(
                            filter: ImageFilter.blur(sigmaX: 22, sigmaY: 22),
                            child: Container(
                              padding: const EdgeInsets.fromLTRB(
                                24,
                                28,
                                24,
                                24,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(28),
                                border: Border.all(
                                  color: Colors.white.withValues(
                                    alpha: 0.4 + glow * 0.25,
                                  ),
                                  width: 1.4,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.white.withValues(
                                      alpha: 0.45 + glow * 0.4,
                                    ),
                                    blurRadius: 24 + glow * 10,
                                    spreadRadius: 1.5,
                                  ),
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.55),
                                    blurRadius: 40,
                                    offset: const Offset(0, 26),
                                  ),
                                ],
                              ),
                              child: child,
                            ),
                          ),
                        ),
                      );
                    },
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'Welcome back',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Sign in to continue shopping',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: Colors.white.withValues(alpha: 0.85),
                          ),
                        ),
                        const SizedBox(height: 24),
                        Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              TextFormField(
                                controller: _emailController,
                                keyboardType: TextInputType.emailAddress,
                                decoration: const InputDecoration(
                                  labelText: 'Email',
                                  prefixIcon: Icon(Icons.email_outlined),
                                  border: OutlineInputBorder(),
                                ),
                                validator: (value) {
                                  if (value == null || value.trim().isEmpty) {
                                    return 'Enter your email';
                                  }
                                  if (!value.contains('@')) {
                                    return 'Enter a valid email';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _passwordController,
                                obscureText: _obscurePassword,
                                decoration: InputDecoration(
                                  labelText: 'Password',
                                  prefixIcon: const Icon(Icons.lock_outline),
                                  border: const OutlineInputBorder(),
                                  suffixIcon: IconButton(
                                    onPressed: () {
                                      setState(() {
                                        _obscurePassword = !_obscurePassword;
                                      });
                                    },
                                    icon: Icon(
                                      _obscurePassword
                                          ? Icons.visibility_off_outlined
                                          : Icons.visibility_outlined,
                                    ),
                                  ),
                                ),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Enter your password';
                                  }
                                  if (value.length < 6) {
                                    return 'Password is too short';
                                  }
                                  return null;
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        if (_error != null)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Text(
                              _error!,
                              style: const TextStyle(
                                color: Colors.redAccent,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 48,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _submit,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF00E58F),
                              foregroundColor: Colors.black,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2.2,
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        Colors.black,
                                      ),
                                    ),
                                  )
                                : const Text(
                                    'Continue',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextButton(
                          onPressed: () {
                            Navigator.of(
                              context,
                            ).pushReplacementNamed('/register');
                          },
                          child: const Text('New here? Create an account'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
