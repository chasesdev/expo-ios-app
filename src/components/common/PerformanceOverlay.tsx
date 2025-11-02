import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

interface PerformanceOverlayProps {
  componentName?: string;
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Performance overlay to display FPS and render metrics
 *
 * Shows real-time performance metrics in development mode.
 * Automatically hidden in production builds.
 *
 * @example
 * ```tsx
 * <View>
 *   <MyApp />
 *   <PerformanceOverlay position="top-right" />
 * </View>
 * ```
 */
export function PerformanceOverlay({
  componentName = 'App',
  enabled = __DEV__,
  position = 'top-right',
}: PerformanceOverlayProps) {
  const metrics = usePerformanceMonitor(componentName, enabled);

  if (!enabled) return null;

  const positionStyles = {
    'top-left': { top: 40, left: 10 },
    'top-right': { top: 40, right: 10 },
    'bottom-left': { bottom: 40, left: 10 },
    'bottom-right': { bottom: 40, right: 10 },
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 58) return '#10B981'; // Green - Excellent
    if (fps >= 50) return '#F59E0B'; // Yellow - Warning
    return '#EF4444'; // Red - Poor
  };

  const getRenderTimeColor = (ms: number) => {
    if (ms <= 16.67) return '#10B981'; // Green - Good
    if (ms <= 33.33) return '#F59E0B'; // Yellow - Acceptable
    return '#EF4444'; // Red - Slow
  };

  return (
    <View style={[styles.container, positionStyles[position]]}>
      <View style={styles.content}>
        {/* FPS */}
        <View style={styles.metricRow}>
          <Text style={styles.label}>FPS</Text>
          <Text style={[styles.value, { color: getFpsColor(metrics.fps) }]}>
            {metrics.fps.toFixed(1)}
          </Text>
        </View>

        {/* Render Time */}
        <View style={styles.metricRow}>
          <Text style={styles.label}>Render</Text>
          <Text
            style={[styles.value, { color: getRenderTimeColor(metrics.renderTime) }]}
          >
            {metrics.renderTime.toFixed(1)}ms
          </Text>
        </View>

        {/* Mount Time (only show if significant) */}
        {metrics.mountTime > 50 && (
          <View style={styles.metricRow}>
            <Text style={styles.label}>Mount</Text>
            <Text style={[styles.value, { color: '#6B7280' }]}>
              {metrics.mountTime.toFixed(0)}ms
            </Text>
          </View>
        )}
      </View>

      {/* Performance indicator */}
      <View
        style={[
          styles.indicator,
          { backgroundColor: getFpsColor(metrics.fps) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 8,
    padding: 8,
    paddingRight: 12,
    minWidth: 100,
    gap: 4,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
