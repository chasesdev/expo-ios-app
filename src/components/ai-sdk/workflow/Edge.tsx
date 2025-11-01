import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Path, Defs, Marker, Polygon, Circle, G, Text as SvgText } from 'react-native-svg';
import { EdgeData, Position, getBezierPath, getStraightPath, getStepPath } from './types';

export interface WorkflowEdgeProps {
  edge: EdgeData;
  sourcePosition: Position;
  targetPosition: Position;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  testID?: string;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Workflow Edge Component - Represents connections between nodes
 * Supports straight, bezier, step paths with optional animations
 */
export function WorkflowEdge({
  edge,
  sourcePosition,
  targetPosition,
  selected = false,
  onPress,
  color = '#94A3B8',
  testID,
}: WorkflowEdgeProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Animate dash offset for animated edges
  useEffect(() => {
    if (edge.animated) {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [edge.animated]);

  // Calculate path
  const getPath = () => {
    switch (edge.type) {
      case 'straight':
        return getStraightPath(sourcePosition, targetPosition);
      case 'step':
        return getStepPath(sourcePosition, targetPosition);
      case 'bezier':
      case 'default':
      default:
        return getBezierPath(sourcePosition, targetPosition);
    }
  };

  const path = getPath();
  const strokeColor = selected ? '#3B82F6' : color;
  const strokeWidth = selected ? 3 : 2;

  // Calculate bounds for SVG
  const minX = Math.min(sourcePosition.x, targetPosition.x) - 20;
  const minY = Math.min(sourcePosition.y, targetPosition.y) - 20;
  const maxX = Math.max(sourcePosition.x, targetPosition.x) + 20;
  const maxY = Math.max(sourcePosition.y, targetPosition.y) + 20;
  const width = maxX - minX;
  const height = maxY - minY;

  // Adjust path to SVG coordinates
  const adjustedPath = path
    .replace(/M\s*([-\d.]+),([-\d.]+)/, (_, x, y) => `M ${Number(x) - minX},${Number(y) - minY}`)
    .replace(/C\s*([-\d.]+),([-\d.]+)\s+([-\d.]+),([-\d.]+)\s+([-\d.]+),([-\d.]+)/g,
      (_, x1, y1, x2, y2, x3, y3) =>
        `C ${Number(x1) - minX},${Number(y1) - minY} ${Number(x2) - minX},${Number(y2) - minY} ${Number(x3) - minX},${Number(y3) - minY}`)
    .replace(/L\s*([-\d.]+),([-\d.]+)/g, (_, x, y) => `L ${Number(x) - minX},${Number(y) - minY}`);

  // Arrow marker ID
  const markerId = `arrow-${edge.id}`;

  return (
    <Svg
      width={width}
      height={height}
      style={[
        styles.edge,
        {
          position: 'absolute',
          left: minX,
          top: minY,
        },
      ]}
    >
      <Defs>
        {/* Arrow marker */}
        <Marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <Polygon
            points="0,0 10,5 0,10"
            fill={strokeColor}
          />
        </Marker>
      </Defs>

      <G>
        {/* Background path for better hit area */}
        <Path
          d={adjustedPath}
          stroke="transparent"
          strokeWidth={12}
          fill="none"
          onPress={onPress}
        />

        {/* Main edge path */}
        <AnimatedPath
          d={adjustedPath}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={edge.animated ? "5,5" : undefined}
          strokeDashoffset={edge.animated ? animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10],
          }) : undefined}
          markerEnd={edge.markerEnd !== 'none' ? `url(#${markerId})` : undefined}
        />

        {/* Edge label */}
        {edge.label && (
          <G>
            <Circle
              cx={(sourcePosition.x + targetPosition.x) / 2 - minX}
              cy={(sourcePosition.y + targetPosition.y) / 2 - minY}
              r="15"
              fill="#FFFFFF"
              stroke={strokeColor}
              strokeWidth="1"
            />
            <SvgText
              x={(sourcePosition.x + targetPosition.x) / 2 - minX}
              y={(sourcePosition.y + targetPosition.y) / 2 - minY}
              fill="#374151"
              fontSize="10"
              fontWeight="600"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {edge.label}
            </SvgText>
          </G>
        )}
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  edge: {
    zIndex: 1,
  },
});

// Example edges
export const exampleEdges: EdgeData[] = [
  {
    id: 'edge-1',
    type: 'bezier',
    source: 'start-1',
    target: 'task-1',
    markerEnd: 'arrowClosed',
  },
  {
    id: 'edge-2',
    type: 'bezier',
    source: 'task-1',
    target: 'code-1',
    animated: true,
    markerEnd: 'arrowClosed',
  },
  {
    id: 'edge-3',
    type: 'straight',
    source: 'code-1',
    target: 'decision-1',
    markerEnd: 'arrowClosed',
  },
  {
    id: 'edge-4',
    type: 'step',
    source: 'decision-1',
    target: 'end-1',
    label: 'Yes',
    markerEnd: 'arrowClosed',
  },
];
