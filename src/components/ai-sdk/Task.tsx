import React from 'react';
import { View, StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';
import { VStack, HStack } from '@expo/ui/swift-ui';
import { Host } from '../common/SwiftUIHost';
import { useTheme } from '../../design-system';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskData = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date;
  tags?: string[];
  progress?: number; // 0-100
  createdAt?: Date;
  updatedAt?: Date;
};

export interface TaskProps {
  task: TaskData;
  variant?: 'default' | 'compact' | 'detailed';
  onPress?: () => void;
  onStatusChange?: (newStatus: TaskStatus) => void;
  testID?: string;
}

const statusConfig = {
  todo: { icon: '⚪', label: 'To Do', color: '#6B7280' },
  in_progress: { icon: '🔵', label: 'In Progress', color: '#3B82F6' },
  completed: { icon: '✅', label: 'Completed', color: '#10B981' },
  blocked: { icon: '🔴', label: 'Blocked', color: '#EF4444' },
  cancelled: { icon: '⚫', label: 'Cancelled', color: '#9CA3AF' },
};

const priorityConfig = {
  low: { icon: '🟢', label: 'Low', color: '#10B981' },
  medium: { icon: '🟡', label: 'Medium', color: '#F59E0B' },
  high: { icon: '🟠', label: 'High', color: '#F97316' },
  urgent: { icon: '🔴', label: 'Urgent', color: '#EF4444' },
};

/**
 * Task component for displaying individual task items
 *
 * @example
 * ```tsx
 * <Task
 *   task={exampleTask}
 *   variant="default"
 *   onPress={() => console.log('Task clicked')}
 *   onStatusChange={(status) => console.log('Status changed:', status)}
 * />
 * ```
 */
export function Task({
  task,
  variant = 'default',
  onPress,
  onStatusChange,
  testID,
}: TaskProps) {
  const theme = useTheme();
  const statusInfo = statusConfig[task.status];
  const priorityInfo = task.priority ? priorityConfig[task.priority] : null;

  const isOverdue = task.dueDate && new Date() > task.dueDate && task.status !== 'completed';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
    >
      <Host
        modifiers={[
          {
            type: 'background',
            color: theme.colors.muted.rgb,
          },
          {
            type: 'cornerRadius',
            radius: theme.radius.md,
          },
          {
            type: 'border',
            color: statusInfo.color,
            width: 2,
            opacity: 0.3,
          },
        ]}
        style={{ padding: variant === 'compact' ? 10 : 14 }}
      >
        <VStack spacing={variant === 'compact' ? 6 : 10}>
          {/* Header Row */}
          <HStack spacing={10} style={{ alignItems: 'center' }}>
            {/* Status Icon */}
            <TouchableOpacity
              onPress={() => onStatusChange?.(task.status === 'completed' ? 'todo' : 'completed')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <RNText style={{ fontSize: 20 }}>{statusInfo.icon}</RNText>
            </TouchableOpacity>

            {/* Title and Info */}
            <View style={{ flex: 1 }}>
              <RNText
                style={[
                  styles.title,
                  {
                    color: theme.colors.foreground.rgb,
                    textDecorationLine: task.status === 'completed' ? 'line-through' : 'none',
                    opacity: task.status === 'completed' || task.status === 'cancelled' ? 0.6 : 1,
                  },
                ]}
              >
                {task.title}
              </RNText>

              {/* Metadata Row */}
              {variant !== 'compact' && (
                <HStack spacing={8} style={{ marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Priority */}
                  {priorityInfo && (
                    <RNText style={[styles.metaText, { color: priorityInfo.color }]}>
                      {priorityInfo.icon} {priorityInfo.label}
                    </RNText>
                  )}

                  {/* Status */}
                  <RNText style={[styles.metaText, { color: statusInfo.color }]}>
                    {statusInfo.label}
                  </RNText>

                  {/* Due Date */}
                  {task.dueDate && (
                    <RNText
                      style={[
                        styles.metaText,
                        {
                          color: isOverdue
                            ? priorityConfig.urgent.color
                            : theme.colors.mutedForeground.rgb,
                        },
                      ]}
                    >
                      {isOverdue ? '⚠️ ' : '📅 '}
                      {task.dueDate.toLocaleDateString()}
                    </RNText>
                  )}

                  {/* Assignee */}
                  {task.assignee && (
                    <RNText style={[styles.metaText, { color: theme.colors.mutedForeground.rgb }]}>
                      👤 {task.assignee}
                    </RNText>
                  )}
                </HStack>
              )}
            </View>
          </HStack>

          {/* Description */}
          {task.description && variant === 'detailed' && (
            <RNText
              style={[
                styles.description,
                { color: theme.colors.mutedForeground.rgb },
              ]}
            >
              {task.description}
            </RNText>
          )}

          {/* Progress Bar */}
          {typeof task.progress === 'number' && variant !== 'compact' && (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: theme.colors.background.rgb },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${task.progress}%`,
                      backgroundColor: statusInfo.color,
                    },
                  ]}
                />
              </View>
              <RNText style={[styles.progressText, { color: theme.colors.mutedForeground.rgb }]}>
                {task.progress}%
              </RNText>
            </View>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && variant === 'detailed' && (
            <HStack spacing={6} style={{ flexWrap: 'wrap' }}>
              {task.tags.map((tag, index) => (
                <Host
                  key={index}
                  modifiers={[
                    {
                      type: 'background',
                      color: theme.colors.primary.rgb + '20',
                    },
                    {
                      type: 'cornerRadius',
                      radius: 4,
                    },
                  ]}
                  style={{ paddingHorizontal: 8, paddingVertical: 3 }}
                >
                  <RNText style={[styles.tag, { color: theme.colors.primary.rgb }]}>
                    {tag}
                  </RNText>
                </Host>
              ))}
            </HStack>
          )}
        </VStack>
      </Host>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '500',
    width: 35,
  },
  tag: {
    fontSize: 10,
    fontWeight: '500',
  },
});

// Example Data
export const exampleTasks: TaskData[] = [
  {
    id: 'task-1',
    title: 'Implement user authentication',
    description: 'Add OAuth 2.0 flow with Google and GitHub providers',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Sarah',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    progress: 65,
    tags: ['backend', 'security', 'auth'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'task-2',
    title: 'Fix memory leak in image loader',
    description: 'Images are not being properly released from memory',
    status: 'blocked',
    priority: 'urgent',
    assignee: 'Mike',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day overdue
    progress: 30,
    tags: ['bug', 'performance', 'critical'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'task-3',
    title: 'Write unit tests for API endpoints',
    status: 'todo',
    priority: 'medium',
    assignee: 'Alex',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    progress: 0,
    tags: ['testing', 'backend'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'task-4',
    title: 'Update dependencies to latest versions',
    description: 'Check for security vulnerabilities and update all npm packages',
    status: 'completed',
    priority: 'low',
    assignee: 'Jordan',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    progress: 100,
    tags: ['maintenance', 'dependencies'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-5',
    title: 'Refactor legacy code in utils module',
    status: 'cancelled',
    priority: 'low',
    assignee: 'Taylor',
    tags: ['refactor', 'tech-debt'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-6',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the analytics dashboard',
    status: 'todo',
    priority: 'medium',
    assignee: 'Casey',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    tags: ['design', 'ui', 'dashboard'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
