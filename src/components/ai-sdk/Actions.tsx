/**
 * Actions Component
 *
 * Displays action button groups with primary/secondary styling.
 *
 * @example
 * ```tsx
 * import { Actions } from '@/components/ai-sdk';
 *
 * <Actions
 *   actions={[
 *     { id: '1', label: 'Save', type: 'primary', onPress: () => {} },
 *     { id: '2', label: 'Cancel', type: 'secondary', onPress: () => {} },
 *   ]}
 *   layout="horizontal"
 * />
 * ```
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';

// Action button types
export type ActionType = 'primary' | 'secondary' | 'tertiary' | 'destructive';

// Action structure
export interface Action {
  id: string;
  label: string;
  icon?: string;
  type?: ActionType;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

// Props interface
export interface ActionsProps {
  actions: Action[];
  layout?: 'horizontal' | 'vertical';
  variant?: 'default' | 'compact' | 'minimal';
  fullWidth?: boolean;
  testID?: string;
}

// Helper: Get glass effect values
const opacityToHex = (opacity: number): string => {
  const hex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return hex.toUpperCase();
};

// Helper: Get button colors based on type
const getButtonColors = (
  type: ActionType,
  pressed: boolean,
  disabled: boolean
): {
  backgroundColor: string;
  textColor: string;
} => {
  if (disabled) {
    return {
      backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.3)}`,
      textColor: theme.colors.text.tertiary,
    };
  }

  switch (type) {
    case 'primary':
      return {
        backgroundColor: pressed
          ? `${theme.colors.primary}${opacityToHex(0.9)}`
          : theme.colors.primary,
        textColor: '#FFFFFF',
      };
    case 'destructive':
      return {
        backgroundColor: pressed
          ? `${theme.colors.destructive}${opacityToHex(0.9)}`
          : theme.colors.destructive,
        textColor: '#FFFFFF',
      };
    case 'tertiary':
      return {
        backgroundColor: 'transparent',
        textColor: pressed ? theme.colors.text.secondary : theme.colors.primary,
      };
    case 'secondary':
    default:
      return {
        backgroundColor: pressed
          ? `${theme.colors.surface.elevated}${opacityToHex(0.9)}`
          : `${theme.colors.surface.elevated}${opacityToHex(0.7)}`,
        textColor: theme.colors.text.primary,
      };
  }
};

// Individual Action Button Component
interface ActionButtonProps {
  action: Action;
  variant: 'default' | 'compact' | 'minimal';
  fullWidth: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, variant, fullWidth }) => {
  const actionType = action.type || 'secondary';
  const isDisabled = action.disabled || action.loading;

  return (
    <Pressable
      onPress={action.onPress}
      disabled={isDisabled}
      style={({ pressed }) => {
        const colors = getButtonColors(actionType, pressed, isDisabled);

        // Base styles
        const baseStyles: any = {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.xs,
          opacity: isDisabled && !action.loading ? 0.5 : 1,
        };

        // Variant-specific styles
        if (variant === 'minimal') {
          return {
            ...baseStyles,
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
          };
        }

        if (variant === 'compact') {
          return {
            ...baseStyles,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: colors.backgroundColor,
            borderWidth: actionType === 'secondary' ? 1 : 0,
            borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
            ...(fullWidth && { flex: 1 }),
          };
        }

        // Default variant
        return {
          ...baseStyles,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.borderRadius.md,
          backgroundColor: colors.backgroundColor,
          borderWidth: actionType === 'secondary' ? 1 : 0,
          borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
          shadowColor: actionType === 'primary' || actionType === 'destructive'
            ? theme.colors.shadow.default
            : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: actionType === 'primary' || actionType === 'destructive' ? 2 : 0,
          ...(fullWidth && { flex: 1 }),
        };
      }}
    >
      {({ pressed }) => {
        const colors = getButtonColors(actionType, pressed, isDisabled);

        return (
          <>
            {action.loading ? (
              <ActivityIndicator size="small" color={colors.textColor} />
            ) : (
              action.icon && <Text style={{ fontSize: variant === 'minimal' ? 14 : 16 }}>{action.icon}</Text>
            )}
            <Text
              style={{
                fontSize:
                  variant === 'minimal'
                    ? theme.typography.caption.fontSize
                    : variant === 'compact'
                    ? theme.typography.body.fontSize
                    : theme.typography.body.fontSize,
                fontWeight: actionType === 'primary' || actionType === 'destructive' ? '600' : '500',
                color: colors.textColor,
              }}
            >
              {action.label}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
};

// Main Actions Component
export const Actions: React.FC<ActionsProps> = ({
  actions,
  layout = 'horizontal',
  variant = 'default',
  fullWidth = false,
  testID = 'actions',
}) => {
  if (actions.length === 0) {
    return null;
  }

  return (
    <View
      testID={testID}
      style={{
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        gap: variant === 'minimal' ? theme.spacing.xs : theme.spacing.sm,
        ...(fullWidth && { width: '100%' }),
      }}
    >
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          action={action}
          variant={variant}
          fullWidth={fullWidth && layout === 'vertical'}
        />
      ))}
    </View>
  );
};

// Example action groups for testing
export const exampleActionGroups = {
  saveCancel: [
    {
      id: 'save',
      label: 'Save',
      icon: '💾',
      type: 'primary' as ActionType,
      onPress: () => console.log('Save'),
    },
    {
      id: 'cancel',
      label: 'Cancel',
      type: 'secondary' as ActionType,
      onPress: () => console.log('Cancel'),
    },
  ],

  confirmDelete: [
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      type: 'destructive' as ActionType,
      onPress: () => console.log('Delete'),
    },
    {
      id: 'cancel',
      label: 'Cancel',
      type: 'secondary' as ActionType,
      onPress: () => console.log('Cancel'),
    },
  ],

  multipleActions: [
    {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      type: 'secondary' as ActionType,
      onPress: () => console.log('Copy'),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: '✏️',
      type: 'secondary' as ActionType,
      onPress: () => console.log('Edit'),
    },
    {
      id: 'share',
      label: 'Share',
      icon: '↗️',
      type: 'secondary' as ActionType,
      onPress: () => console.log('Share'),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      type: 'tertiary' as ActionType,
      onPress: () => console.log('Delete'),
    },
  ],

  loadingState: [
    {
      id: 'submit',
      label: 'Submitting...',
      type: 'primary' as ActionType,
      loading: true,
      disabled: true,
      onPress: () => {},
    },
    {
      id: 'cancel',
      label: 'Cancel',
      type: 'secondary' as ActionType,
      disabled: true,
      onPress: () => {},
    },
  ],

  singlePrimary: [
    {
      id: 'continue',
      label: 'Continue',
      icon: '→',
      type: 'primary' as ActionType,
      onPress: () => console.log('Continue'),
    },
  ],
};

// Example: Actions in a card
export const ExampleActionsCard: React.FC = () => {
  return (
    <View style={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Default - Horizontal
        </Text>
        <Actions
          actions={exampleActionGroups.saveCancel}
          layout="horizontal"
          variant="default"
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Default - Vertical (Full Width)
        </Text>
        <Actions
          actions={exampleActionGroups.confirmDelete}
          layout="vertical"
          variant="default"
          fullWidth
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Compact - Horizontal
        </Text>
        <Actions
          actions={exampleActionGroups.multipleActions}
          layout="horizontal"
          variant="compact"
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Minimal - Horizontal
        </Text>
        <Actions
          actions={exampleActionGroups.multipleActions}
          layout="horizontal"
          variant="minimal"
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Loading State
        </Text>
        <Actions
          actions={exampleActionGroups.loadingState}
          layout="horizontal"
          variant="default"
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Single Primary (Full Width)
        </Text>
        <Actions
          actions={exampleActionGroups.singlePrimary}
          layout="vertical"
          variant="default"
          fullWidth
        />
      </View>
    </View>
  );
};
