import React, { useState } from 'react';
import { Host, VStack, HStack, Text } from '@expo/ui/swift-ui';
import { TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useTheme } from '../../design-system';
import {
  MaterialVariant,
  getBlurForMaterial,
  getOpacityForMaterial,
  opacityToHex,
} from '../../design-system/glass-tokens';
import { SuggestionOption } from './Suggestion';

export interface PromptAttachment {
  id: string;
  type: 'image' | 'file' | 'voice';
  name: string;
  url?: string;
  data?: any;
  size?: number;
}

export interface PromptInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: (text: string, attachments: PromptAttachment[]) => void;
  placeholder?: string;
  showAttachments?: boolean;
  showVoice?: boolean;
  showSuggestions?: boolean;
  suggestions?: SuggestionOption[];
  onSuggestionSelect?: (suggestion: SuggestionOption) => void;
  disabled?: boolean;
  maxLength?: number;
  multiline?: boolean;
  minHeight?: number;
  maxHeight?: number;
  sendButtonIcon?: string;
  attachmentButtonIcon?: string;
  voiceButtonIcon?: string;
  testID?: string;
}

/**
 * AI SDK PromptInput component with attachments and suggestions
 *
 * Multi-feature input component for chat interfaces with support for
 * text input, attachments (images, files, voice), and suggestion chips.
 *
 * @example
 * ```tsx
 * <PromptInput
 *   value={text}
 *   onChange={setText}
 *   onSend={(text, attachments) => console.log(text, attachments)}
 *   showAttachments
 *   showVoice
 *   showSuggestions
 * />
 * ```
 */
export function PromptInput({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message...',
  showAttachments = true,
  showVoice = true,
  showSuggestions = false,
  suggestions = [],
  onSuggestionSelect,
  disabled = false,
  maxLength = 2000,
  multiline = true,
  minHeight = 44,
  maxHeight = 120,
  sendButtonIcon = '↑',
  attachmentButtonIcon = '📎',
  voiceButtonIcon = '🎤',
  testID,
}: PromptInputProps) {
  const theme = useTheme();
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const glassVariant: MaterialVariant = 'thin';
  const blurRadius = getBlurForMaterial(glassVariant);
  const opacity = getOpacityForMaterial(glassVariant);
  const opacityHex = opacityToHex(opacity);

  const canSend = value.trim().length > 0 || attachments.length > 0;

  const handleSend = () => {
    if (canSend && !disabled) {
      onSend(value, attachments);
      onChange('');
      setAttachments([]);
    }
  };

  const handleAttachment = () => {
    // In a real app, this would open the image/file picker
    Alert.alert(
      'Add Attachment',
      'Choose attachment type',
      [
        {
          text: 'Image',
          onPress: () => addAttachment('image', 'example.jpg'),
        },
        {
          text: 'File',
          onPress: () => addAttachment('file', 'document.pdf'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleVoice = () => {
    // In a real app, this would start voice recording
    Alert.alert('Voice Input', 'Voice recording would start here in a production app');
  };

  const addAttachment = (type: 'image' | 'file' | 'voice', name: string) => {
    const newAttachment: PromptAttachment = {
      id: Date.now().toString(),
      type,
      name,
      size: Math.floor(Math.random() * 1000000), // Mock size
    };
    setAttachments([...attachments, newAttachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSuggestionSelect = (suggestion: SuggestionOption) => {
    onChange(value + (value ? ' ' : '') + suggestion.label);
    onSuggestionSelect?.(suggestion);
  };

  return (
    <Host testID={testID}>
      <VStack spacing={8}>
        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: theme.spacing.sm, gap: 8 }}
          >
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                onPress={() => handleSuggestionSelect(suggestion)}
              >
                <Host
                  modifiers={[
                    {
                      type: 'background',
                      color: theme.colors.muted.rgb,
                    },
                    { type: 'cornerRadius', radius: theme.radius.sm },
                  ]}
                  style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                >
                  <HStack spacing={4} style={{ alignItems: 'center' }}>
                    {suggestion.icon && (
                      <Text style={{ fontSize: 12 }}>{suggestion.icon}</Text>
                    )}
                    <Text style={{ fontSize: 12, fontWeight: '500' }}>
                      {suggestion.label}
                    </Text>
                  </HStack>
                </Host>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Main Input Container */}
        <Host
          modifiers={[
            { type: 'blur', radius: blurRadius },
            {
              type: 'background',
              color: theme.colors.background.rgb + opacityHex,
            },
            {
              type: 'border',
              color: isFocused ? theme.colors.primary.rgb : theme.colors.border.rgb,
              width: isFocused ? 2 : 1,
              opacity: isFocused ? 0.6 : 0.3,
            },
            { type: 'cornerRadius', radius: theme.radius.lg },
            {
              type: 'shadow',
              color: '#00000010',
              radius: 12,
              x: 0,
              y: 4,
            },
            { type: 'compositingGroup' },
          ]}
          style={{ padding: theme.spacing.sm }}
        >
          <VStack spacing={8}>
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {attachments.map((attachment) => (
                  <Host
                    key={attachment.id}
                    modifiers={[
                      {
                        type: 'background',
                        color: theme.colors.muted.rgb,
                      },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ padding: 8, minWidth: 120 }}
                  >
                    <HStack spacing={6} style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 14 }}>
                        {attachment.type === 'image' && '🖼️'}
                        {attachment.type === 'file' && '📄'}
                        {attachment.type === 'voice' && '🎵'}
                      </Text>
                      <VStack spacing={2} style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, fontWeight: '500' }} numberOfLines={1}>
                          {attachment.name}
                        </Text>
                        {attachment.size && (
                          <Text style={{ fontSize: 10, color: theme.colors.mutedForeground.rgb }}>
                            {(attachment.size / 1024).toFixed(1)}KB
                          </Text>
                        )}
                      </VStack>
                      <TouchableOpacity onPress={() => removeAttachment(attachment.id)}>
                        <Text style={{ fontSize: 14 }}>✕</Text>
                      </TouchableOpacity>
                    </HStack>
                  </Host>
                ))}
              </ScrollView>
            )}

            {/* Input Row */}
            <HStack spacing={8} style={{ alignItems: 'center' }}>
              {/* Text Input */}
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.mutedForeground.rgb}
                multiline={multiline}
                maxLength={maxLength}
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  flex: 1,
                  fontSize: 15,
                  lineHeight: 20,
                  color: theme.colors.foreground.rgb,
                  minHeight,
                  maxHeight,
                  paddingVertical: 8,
                  paddingHorizontal: 4,
                }}
              />

              {/* Action Buttons */}
              <VStack spacing={6}>
                <HStack spacing={8}>
                  {/* Attachment Button */}
                  {showAttachments && (
                    <TouchableOpacity
                      onPress={handleAttachment}
                      disabled={disabled}
                    >
                      <Host
                        modifiers={[
                          {
                            type: 'background',
                            color: theme.colors.muted.rgb,
                          },
                          { type: 'cornerRadius', radius: 16 },
                        ]}
                        style={{
                          width: 32,
                          height: 32,
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: disabled ? 0.5 : 1,
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{attachmentButtonIcon}</Text>
                      </Host>
                    </TouchableOpacity>
                  )}

                  {/* Voice Button */}
                  {showVoice && !value && (
                    <TouchableOpacity
                      onPress={handleVoice}
                      disabled={disabled}
                    >
                      <Host
                        modifiers={[
                          {
                            type: 'background',
                            color: theme.colors.muted.rgb,
                          },
                          { type: 'cornerRadius', radius: 16 },
                        ]}
                        style={{
                          width: 32,
                          height: 32,
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: disabled ? 0.5 : 1,
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{voiceButtonIcon}</Text>
                      </Host>
                    </TouchableOpacity>
                  )}

                  {/* Send Button */}
                  {(canSend || !showVoice) && (
                    <TouchableOpacity
                      onPress={handleSend}
                      disabled={!canSend || disabled}
                    >
                      <Host
                        modifiers={[
                          {
                            type: 'background',
                            color: canSend && !disabled
                              ? theme.colors.primary.rgb
                              : theme.colors.muted.rgb,
                          },
                          { type: 'cornerRadius', radius: 16 },
                        ]}
                        style={{
                          width: 32,
                          height: 32,
                          justifyContent: 'center',
                          alignItems: 'center',
                          opacity: !canSend || disabled ? 0.5 : 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: canSend && !disabled ? '#FFFFFF' : theme.colors.foreground.rgb,
                          }}
                        >
                          {sendButtonIcon}
                        </Text>
                      </Host>
                    </TouchableOpacity>
                  )}
                </HStack>
              </VStack>
            </HStack>

            {/* Character Count */}
            {value.length > maxLength * 0.8 && (
              <Text
                style={{
                  fontSize: 10,
                  color: value.length >= maxLength
                    ? theme.colors.destructive.rgb
                    : theme.colors.mutedForeground.rgb,
                  textAlign: 'right',
                }}
              >
                {value.length}/{maxLength}
              </Text>
            )}
          </VStack>
        </Host>
      </VStack>
    </Host>
  );
}

// Example suggestions for testing
export const examplePromptSuggestions: SuggestionOption[] = [
  {
    id: '1',
    label: 'Explain this',
    icon: '💡',
  },
  {
    id: '2',
    label: 'Write code',
    icon: '💻',
  },
  {
    id: '3',
    label: 'Summarize',
    icon: '📝',
  },
  {
    id: '4',
    label: 'Translate',
    icon: '🌐',
  },
];
