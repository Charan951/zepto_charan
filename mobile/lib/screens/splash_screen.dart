import 'package:flutter/material.dart';
import 'package:glassmorphic_ui_kit/glassmorphic_ui_kit.dart';

class SplashScreen extends StatefulWidget {
  final VoidCallback onTap;

  const SplashScreen({super.key, required this.onTap});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _glow;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2600),
    )..repeat(reverse: true);
    final curve = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOutCubic,
      reverseCurve: Curves.easeInOutCubic,
    );
    _glow = Tween<double>(begin: 0.6, end: 1).animate(curve);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF00110B), Color(0xFF005F3A), Color(0xFF00E58F)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              left: -80,
              top: -40,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF00FFB3).withValues(alpha: 0.18),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF00FFB3).withValues(alpha: 0.5),
                      blurRadius: 80,
                      spreadRadius: 6,
                    ),
                  ],
                ),
              ),
            ),
            Positioned(
              right: -60,
              bottom: -40,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF00FFC6).withValues(alpha: 0.16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF00FFC6).withValues(alpha: 0.45),
                      blurRadius: 70,
                      spreadRadius: 4,
                    ),
                  ],
                ),
              ),
            ),
            Positioned(
              right: -120,
              top: 80,
              child: Transform.rotate(
                angle: -0.45,
                child: Container(
                  width: 320,
                  height: 4,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    gradient: const LinearGradient(
                      colors: [
                        Colors.transparent,
                        Color(0xFF7CFFD1),
                        Colors.transparent,
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF7CFFD1).withValues(alpha: 0.65),
                        blurRadius: 30,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              left: -140,
              bottom: 100,
              child: Transform.rotate(
                angle: -0.55,
                child: Container(
                  width: 280,
                  height: 3,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    gradient: const LinearGradient(
                      colors: [
                        Colors.transparent,
                        Color(0xFF4BFFB8),
                        Colors.transparent,
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF4BFFB8).withValues(alpha: 0.55),
                        blurRadius: 26,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Center(
              child: TweenAnimationBuilder<double>(
                tween: Tween(begin: 0.86, end: 1),
                duration: const Duration(milliseconds: 700),
                curve: Curves.easeOutCubic,
                builder: (context, value, child) {
                  return Transform.scale(
                    scale: value,
                    child: Opacity(opacity: value.clamp(0, 1), child: child),
                  );
                },
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AnimatedBuilder(
                      animation: _controller,
                      builder: (context, child) {
                        final glow = _glow.value;
                        final wobble = (glow - 0.75);
                        final verticalOffset = wobble * -22;
                        final matrix = Matrix4.identity()
                          ..setEntry(3, 2, 0.001)
                          ..rotateX(-0.28 + wobble * 0.12)
                          ..rotateY(0.18 + wobble * 0.08);
                        final screenWidth = MediaQuery.of(context).size.width;
                        return Transform.translate(
                          offset: Offset(0, verticalOffset),
                          child: Transform(
                            alignment: Alignment.center,
                            transform: matrix,
                            child: GlassContainer(
                              width: screenWidth * 0.82,
                              height: null,
                              blur: 20,
                              borderRadius: BorderRadius.circular(32),
                              padding: const EdgeInsets.all(32),
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Colors.white.withAlpha(42),
                                  Colors.white.withAlpha(18),
                                ],
                              ),
                              child: child,
                            ),
                          ),
                        );
                      },
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(24),
                            child: Container(
                              width: 120,
                              height: 120,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(
                                  color: const Color(0xFFB2FFE0),
                                  width: 1.6,
                                ),
                              ),
                              clipBehavior: Clip.antiAlias,
                              child: Image.asset(
                                'logo1.jpeg',
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          const Text(
                            'Sri Ram Traders and General Store',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1.2,
                              color: Colors.white,
                              decoration: TextDecoration.none,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Fresh groceries in minutes',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withValues(alpha: 0.86),
                              decoration: TextDecoration.none,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0, end: 1),
                      duration: const Duration(milliseconds: 700),
                      curve: Curves.easeOutCubic,
                      builder: (context, value, child) {
                        return Transform.translate(
                          offset: Offset(0, (1 - value) * 18),
                          child: Opacity(opacity: value, child: child),
                        );
                      },
                      child: GlassButton(
                        onPressed: widget.onTap,
                        blur: 14,
                        borderRadius: BorderRadius.circular(999),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 14,
                        ),
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Colors.white.withAlpha(60),
                            Colors.white.withAlpha(26),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Tap to start',
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.96),
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                decoration: TextDecoration.none,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              width: 26,
                              height: 26,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withValues(alpha: 0.18),
                              ),
                              child: const Icon(
                                Icons.arrow_forward_rounded,
                                size: 18,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

