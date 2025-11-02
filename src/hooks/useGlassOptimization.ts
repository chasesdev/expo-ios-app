import { useState, useEffect } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { glassRequirements } from '../design-system/glass-tokens';

export interface GlassOptimizationResult {
  /**
   * Whether glass effects should be used
   * False when user has "Reduce Transparency" enabled or device doesn't support it
   */
  shouldUseGlass: boolean;

  /**
   * Whether "Reduce Transparency" accessibility setting is enabled
   */
  reduceTransparency: boolean;

  /**
   * Whether the device supports glass effects (iOS 15+)
   */
  isCapable: boolean;

  /**
   * Whether the device supports advanced iOS 26+ glass effects
   */
  supportsAdvanced: boolean;

  /**
   * Recommended variant to use: 'glass' or 'solid'
   */
  variant: 'glass' | 'solid';
}

/**
 * Hook to determine if glass effects should be used based on:
 * - Device capability (iOS version)
 * - Accessibility settings ("Reduce Transparency")
 * - Performance considerations
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { shouldUseGlass, variant } = useGlassOptimization();
 *
 *   return (
 *     <Card variant={variant}>
 *       Content
 *     </Card>
 *   );
 * }
 * ```
 */
export function useGlassOptimization(): GlassOptimizationResult {
  const [reduceTransparency, setReduceTransparency] = useState(false);

  // Check device capability
  const rawIosVersion = Platform.OS === 'ios' ? Platform.Version : 0;
  // Ensure we always compare numbers to numbers.
  const iosVersion =
    typeof rawIosVersion === 'string'
      ? parseInt(rawIosVersion.split('.')[0], 10)
      : rawIosVersion;

  const isCapable = iosVersion >= glassRequirements.minimumIOSVersion;
  const supportsAdvanced = iosVersion >= glassRequirements.advancedIOSVersion;

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    // Check initial accessibility setting
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then((enabled) => {
        setReduceTransparency(enabled);
      })
      .catch(() => {
        // Fallback to false if check fails
        setReduceTransparency(false);
      });

    // Listen for changes to accessibility settings
    const subscription = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      (enabled) => {
        setReduceTransparency(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const shouldUseGlass = isCapable && !reduceTransparency;
  const variant = shouldUseGlass ? 'glass' : 'solid';

  return {
    shouldUseGlass,
    reduceTransparency,
    isCapable,
    supportsAdvanced,
    variant,
  };
}

/**
 * Hook to monitor performance and auto-adjust glass quality
 * Tracks frame rate and reduces blur quality if FPS drops below threshold
 *
 * @param fpsThreshold - Minimum FPS to maintain (default: 50)
 */
export function usePerformanceMonitor(fpsThreshold: number = 50) {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(60);

  useEffect(() => {
    // Simple FPS monitoring using requestAnimationFrame
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        setCurrentFPS(fps);
        setIsLowPerformance(fps < fpsThreshold);

        // Reset counters
        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [fpsThreshold]);

  return {
    isLowPerformance,
    currentFPS,
    shouldReduceQuality: isLowPerformance,
  };
}

/**
 * Hook that combines glass optimization with performance monitoring
 * Automatically disables glass effects if performance drops
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { shouldUseGlass, performanceWarning } = useSmartGlass();
 *
 *   return (
 *     <View>
 *       {performanceWarning && <Text>Performance mode active</Text>}
 *       <Card variant={shouldUseGlass ? 'glass' : 'solid'}>
 *         Content
 *       </Card>
 *     </View>
 *   );
 * }
 * ```
 */
export function useSmartGlass() {
  const { shouldUseGlass: accessibilityShouldUse, ...glassOpt } = useGlassOptimization();
  const { isLowPerformance, currentFPS } = usePerformanceMonitor();

  const shouldUseGlass = accessibilityShouldUse && !isLowPerformance;
  const performanceWarning = isLowPerformance;

  return {
    shouldUseGlass,
    performanceWarning,
    currentFPS,
    ...glassOpt,
  };
}
