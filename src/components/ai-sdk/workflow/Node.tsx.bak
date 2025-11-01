import React from 'react';
import { View, StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';
import { VStack, HStack } from '@expo/ui/swift-ui';
import { Host } from '../../common/SwiftUIHost';
import { useTheme } from '../../../design-system';
import { NodeData, NodeType, NodeStatus } from './types';

export interface WorkflowNodeProps {
  node: NodeData;
  selected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onDragStart?: () => void;
  onDrag?: (delta: { x: number; y: number }) => void;
  onDragEnd?: () => void;
  renderHandle?: (type: 'source' | 'target', position: 'top' | 'right' | 'bottom' | 'left') => React.ReactNode;
  testID?: string;
}

const nodeTypeConfig = {
  task: { icon: '✓', label: 'Task', color: '#3B82F6', bgColor: '#3B82F615' },
  code: { icon: '</>',label: 'Code', color: '#8B5CF6', bgColor: '#8B5CF615' },
  decision: { icon: '◇', label: 'Decision', color: '#F59E0B', bgColor: '#F59E0B15' },
  start: { icon: '▶', label: 'Start', color: '#10B981', bgColor: '#10B98115' },
  end: { icon: '■', label: 'End', color: '#EF4444', bgColor: '#EF444415' },
  generic: { icon: '○', label: 'Step', color: '#6B7280', bgColor: '#6B728015' },
};

const statusConfig = {
  idle: { icon: '⚪', color: '#9CA3AF' },
  running: { icon: '🔵', color: '#3B82F6' },
  success: { icon: '✅', color: '#10B981' },
  error: { icon: '❌', color: '#EF4444' },
  warning: { icon: '⚠️', color: '#F59E0B' },
};

/**
 * Workflow Node Component - Represents a single node in the workflow
 * Supports task, code, decision, start, end, and generic node types
 */
export function WorkflowNode({
  node,
  selected = false,
  onPress,
  onLongPress,
  onDragStart,
  onDrag,
  onDragEnd,
  renderHandle,
  testID,
}: WorkflowNodeProps) {
  const theme = useTheme();
  const config = nodeTypeConfig[node.type];
  const status = node.data.status ? statusConfig[node.data.status] : null;
  const width = node.size?.width || 180;
  const height = node.size?.height || 'auto';

  return (
    <View
      style={[
        styles.nodeContainer,
        {
          position: 'absolute',
          left: node.position.x,
          top: node.position.y,
          width,
          minHeight: height !== 'auto' ? height : undefined,
        },
      ]}
      testID={testID}
    >
      {/* Handles */}
      {renderHandle && (
        <>
          {renderHandle('target', 'top')}
          {renderHandle('source', 'right')}
          {renderHandle('source', 'bottom')}
          {renderHandle('target', 'left')}
        </>
      )}

      {/* Node Body */}
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onDragStart}
        activeOpacity={0.9}
      >
        <Host
          modifiers={[
            { type: 'background', color: config.bgColor },
            { type: 'cornerRadius', radius: node.type === 'decision' ? 8 : theme.radius.lg },
            {
              type: 'border',
              color: selected ? theme.colors.primary.rgb : config.color,
              width: selected ? 3 : 2,
              opacity: selected ? 1 : 0.5,
            },
            {
              type: 'shadow',
              color: '#00000020',
              radius: selected ? 12 : 8,
              x: 0,
              y: selected ? 6 : 4,
            },
          ]}
          style={{
            padding: 12,
            transform: node.type === 'decision' ? [{ rotate: '45deg' }] : undefined,
          }}
        >
          <VStack spacing={8} style={node.type === 'decision' ? { transform: [{ rotate: '-45deg' }] } : {}}>
              {/* Header */}
              <HStack spacing={8} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 18 }}>{config.icon}</RNText>
                <View style={{ flex: 1 }}>
                  <RNText style={[styles.nodeLabel, { color: theme.colors.foreground.rgb }]} numberOfLines={2}>
                    {node.data.label}
                  </RNText>
                  {node.data.description && (
                    <RNText style={[styles.nodeDescription, { color: theme.colors.mutedForeground.rgb }]} numberOfLines={1}>
                      {node.data.description}
                    </RNText>
                  )}
                </View>
                {status && <RNText style={{ fontSize: 16 }}>{status.icon}</RNText>}
              </HStack>

              {/* Progress Bar */}
              {typeof node.data.progress === 'number' && node.data.progress > 0 && (
                <View style={[styles.progressBar, { backgroundColor: theme.colors.muted.rgb }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${node.data.progress}%`, backgroundColor: config.color },
                    ]}
                  />
                </View>
              )}

              {/* Code Preview */}
              {node.type === 'code' && node.data.code && (
                <View style={[styles.codeBlock, { backgroundColor: theme.colors.background.rgb }]}>
                  <RNText style={[styles.codeText, { color: theme.colors.foreground.rgb }]} numberOfLines={3}>
                    {node.data.code}
                  </RNText>
                </View>
              )}

              {/* Decision Conditions */}
              {node.type === 'decision' && node.data.conditions && (
                <VStack spacing={4}>
                  {node.data.conditions.slice(0, 2).map((cond: any) => (
                    <RNText key={cond.id} style={[styles.condition, { color: theme.colors.mutedForeground.rgb }]} numberOfLines={1}>
                      • {cond.label}
                    </RNText>
                  ))}
                </VStack>
              )}

              {/* Task Info */}
              {node.type === 'task' && (
                <HStack spacing={8} style={{ flexWrap: 'wrap' }}>
                  {node.data.assignee && (
                    <RNText style={[styles.metadata, { color: theme.colors.mutedForeground.rgb }]}>
                      👤 {node.data.assignee}
                    </RNText>
                  )}
                  {node.data.dueDate && (
                    <RNText style={[styles.metadata, { color: theme.colors.mutedForeground.rgb }]}>
                      📅 {new Date(node.data.dueDate).toLocaleDateString()}
                    </RNText>
                  )}
                </HStack>
              )}
            </VStack>
        </Host>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nodeContainer: {
    zIndex: 10,
  },
  nodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  nodeDescription: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  codeBlock: {
    padding: 8,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 10,
    fontFamily: 'Menlo, Monaco, Courier New, monospace',
    lineHeight: 14,
  },
  condition: {
    fontSize: 11,
    lineHeight: 14,
  },
  metadata: {
    fontSize: 10,
    lineHeight: 13,
  },
});

// Example nodes
export const exampleNodes: NodeData[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 100, y: 50 },
    data: { label: 'Start Workflow', icon: '▶' },
  },
  {
    id: 'task-1',
    type: 'task',
    position: { x: 100, y: 180 },
    data: {
      label: 'Fetch User Data',
      description: 'Get user from database',
      status: 'success',
      progress: 100,
      assignee: 'API Service',
    },
  },
  {
    id: 'code-1',
    type: 'code',
    position: { x: 350, y: 180 },
    data: {
      label: 'Transform Data',
      code: 'const result = data\n  .filter(x => x.active)\n  .map(x => x.id);',
      language: 'javascript',
      status: 'running',
      progress: 65,
    },
  },
  {
    id: 'decision-1',
    type: 'decision',
    position: { x: 225, y: 320 },
    data: {
      label: 'Is Valid?',
      conditions: [
        { id: 'yes', label: 'Yes', value: 'true' },
        { id: 'no', label: 'No', value: 'false' },
      ],
      status: 'idle',
    },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 225, y: 480 },
    data: { label: 'End', icon: '■' },
  },
];
