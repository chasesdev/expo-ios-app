import { useEffect, useRef, useState } from 'react';

export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  mountTime: number;
}

/**
 * Hook to monitor component performance metrics
 *
 * Tracks FPS, render time, and mount time for performance optimization.
 * Use in development to identify performance bottlenecks.
 *
 * @param componentName - Name of the component for logging
 * @param enabled - Whether monitoring is enabled (default: __DEV__)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const metrics = usePerformanceMonitor('MyComponent');
 *
 *   return (
 *     <View>
 *       <Text>FPS: {metrics.fps.toFixed(1)}</Text>
 *       <Text>Render Time: {metrics.renderTime.toFixed(2)}ms</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function usePerformanceMonitor(
  componentName: string = 'Component',
  enabled: boolean = __DEV__
): PerformanceMetrics {
  const mountTimeRef = useRef(Date.now());
  const renderCountRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());
  const fpsRef = useRef(60);

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    mountTime: 0,
  });

  // Track mount time
  useEffect(() => {
    if (!enabled) return;

    const mountTime = Date.now() - mountTimeRef.current;

    if (mountTime > 16.67) {
      // Warn if mount time exceeds 1 frame (60fps = 16.67ms per frame)
      console.warn(
        `[Performance] ${componentName} took ${mountTime.toFixed(2)}ms to mount (>16.67ms)`
      );
    }

    setMetrics(prev => ({ ...prev, mountTime }));
  }, [componentName, enabled]);

  // Track render time and FPS
  useEffect(() => {
    if (!enabled) return;

    const renderStartTime = Date.now();
    renderCountRef.current++;

    // Calculate render time
    requestAnimationFrame(() => {
      const renderTime = Date.now() - renderStartTime;

      // Calculate FPS (simple approximation)
      const now = Date.now();
      const frameDelta = now - lastFrameTimeRef.current;
      if (frameDelta > 0) {
        const currentFps = 1000 / frameDelta;
        // Smooth FPS with exponential moving average
        fpsRef.current = fpsRef.current * 0.9 + currentFps * 0.1;
      }
      lastFrameTimeRef.current = now;

      // Warn if render time exceeds 1 frame
      if (renderTime > 16.67) {
        console.warn(
          `[Performance] ${componentName} render #${renderCountRef.current} took ${renderTime.toFixed(
            2
          )}ms (>16.67ms)`
        );
      }

      setMetrics({
        fps: Math.min(fpsRef.current, 60), // Cap at 60fps
        renderTime,
        mountTime: metrics.mountTime,
      });
    });
  });

  return metrics;
}

/**
 * Hook to measure and log performance of expensive operations
 *
 * @param operationName - Name of the operation to measure
 * @param enabled - Whether monitoring is enabled (default: __DEV__)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const measurePerformance = usePerformanceMeasure('DataProcessing');
 *
 *   const processData = () => {
 *     const endMeasure = measurePerformance();
 *     // ... expensive operation ...
 *     endMeasure();
 *   };
 * }
 * ```
 */
export function usePerformanceMeasure(
  operationName: string = 'Operation',
  enabled: boolean = __DEV__
): () => () => void {
  return () => {
    if (!enabled) return () => {};

    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;

      if (duration > 100) {
        console.warn(
          `[Performance] ${operationName} took ${duration.toFixed(2)}ms (>100ms)`
        );
      } else if (duration > 16.67) {
        console.log(
          `[Performance] ${operationName} took ${duration.toFixed(2)}ms (>16.67ms)`
        );
      }

      return duration;
    };
  };
}

/**
 * Log performance metrics to console in a formatted way
 */
export function logPerformanceMetrics(
  componentName: string,
  metrics: PerformanceMetrics
) {
  console.log(`
╔═══════════════════════════════════════════════════════
║ Performance Metrics: ${componentName}
╟───────────────────────────────────────────────────────
║ FPS:         ${metrics.fps.toFixed(1)} fps ${
    metrics.fps < 50 ? '⚠️' : metrics.fps < 58 ? '⚡' : '✅'
  }
║ Render Time: ${metrics.renderTime.toFixed(2)}ms ${
    metrics.renderTime > 16.67 ? '⚠️' : '✅'
  }
║ Mount Time:  ${metrics.mountTime.toFixed(2)}ms ${
    metrics.mountTime > 100 ? '⚠️' : '✅'
  }
╚═══════════════════════════════════════════════════════
  `);
}
