import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text as RNText, TouchableOpacity } from 'react-native';
import { Host, VStack, Text, HStack } from '@expo/ui/swift-ui';
import { useTheme } from '../design-system';
import {
  Message,
  Response,
  Suggestion,
  Conversation,
  PromptInput,
  Artifact,
  AIImage,
  Sources,
  WebPreview,
  Tool,
  Context,
  Actions,
  Terminal,
  exampleMessages,
  exampleResponses,
  exampleSuggestions,
  exampleArtifacts,
  exampleImages,
  exampleSources,
  exampleWebPreviews,
  exampleTools,
  exampleContextItems,
  exampleActionGroups,
  exampleRecordings,
} from '../components/ai-sdk';

export function AIComponentsScreen() {
  const theme = useTheme();

  // Demo visibility state
  const [showMessageDemo, setShowMessageDemo] = useState(false);
  const [showResponseDemo, setShowResponseDemo] = useState(false);
  const [showSuggestionDemo, setShowSuggestionDemo] = useState(false);
  const [showArtifactDemo, setShowArtifactDemo] = useState(false);
  const [showTerminalDemo, setShowTerminalDemo] = useState(false);
  const [showToolDemo, setShowToolDemo] = useState(false);
  const [showActionsDemo, setShowActionsDemo] = useState(false);

  // Variant state
  const [messageVariant, setMessageVariant] = useState<'default' | 'compact' | 'detailed' | 'minimal'>('default');

  const componentCategories = [
    {
      title: 'Conversation Components',
      components: ['Message', 'Conversation', 'PromptInput', 'Response', 'Suggestion'],
    },
    {
      title: 'Planning & Tasks',
      components: ['Plan', 'Task', 'ChainOfThought', 'Reasoning'],
    },
    {
      title: 'Content Display',
      components: ['Artifact', 'BracesCodeBlock', 'Context', 'Image', 'Sources', 'InlineCitation', 'WebPreview'],
    },
    {
      title: 'Visual & Interactive',
      components: ['Canvas', 'Node', 'Edge', 'NodeGroup', 'Connection', 'Controls', 'Branch'],
    },
    {
      title: 'UI Actions',
      components: ['Actions', 'Toolbar', 'OpenInChat', 'Tool', 'Loader', 'Shimmer', 'Panel'],
    },
    {
      title: 'Workflow Components',
      components: ['AnimatedEdge', 'CustomNode', 'WorkflowPlanner'],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.rgb }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Host style={{ padding: 20 }}>
          <VStack spacing={32}>
            {/* Header */}
            <VStack spacing={8}>
              <Text style={{ fontSize: 28, fontWeight: '600' }}>
                AI SDK Components
              </Text>
              <Text style={{ fontSize: 14, opacity: 0.7 }}>
                30 specialized components for AI applications
              </Text>
            </VStack>

            {/* Component Categories */}
            {componentCategories.map((category, index) => (
              <VStack key={index} spacing={12}>
                <RNText style={{ fontSize: 18, fontWeight: '600', lineHeight: 24, marginBottom: 8, color: theme.colors.foreground.rgb }}>
                  {category.title}
                </RNText>
                <View style={[styles.componentGrid, { borderColor: theme.colors.border.rgb }]}>
                  {category.components.map((component, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.componentCard,
                        {
                          backgroundColor: theme.colors.muted.rgb,
                          borderColor: theme.colors.border.rgb,
                        },
                      ]}
                    >
                      <RNText style={[styles.componentName, { color: theme.colors.foreground.rgb }]}>
                        {component}
                      </RNText>
                    </View>
                  ))}
                </View>
              </VStack>
            ))}

            {/* Message Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Message Component
                </RNText>
                <TouchableOpacity onPress={() => setShowMessageDemo(!showMessageDemo)}>
                  <Host
                    modifiers={[
                      {
                        type: 'background',
                        color: theme.colors.primary.rgb,
                      },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showMessageDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showMessageDemo && (
                <VStack spacing={16}>
                  {/* Variant Selector */}
                  <VStack spacing={8}>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>Variant:</Text>
                    <HStack spacing={8}>
                      {(['default', 'compact', 'detailed', 'minimal'] as const).map((variant) => (
                        <TouchableOpacity
                          key={variant}
                          onPress={() => setMessageVariant(variant)}
                        >
                          <Host
                            modifiers={[
                              {
                                type: 'background',
                                color: messageVariant === variant
                                  ? theme.colors.primary.rgb
                                  : theme.colors.muted.rgb,
                              },
                              { type: 'cornerRadius', radius: theme.radius.sm },
                            ]}
                            style={{ paddingHorizontal: 10, paddingVertical: 6 }}
                          >
                            <Text
                              style={{
                                color: messageVariant === variant ? '#FFFFFF' : theme.colors.foreground.rgb,
                                fontSize: 11,
                                fontWeight: '500',
                              }}
                            >
                              {variant}
                            </Text>
                          </Host>
                        </TouchableOpacity>
                      ))}
                    </HStack>
                  </VStack>

                  {/* Example Messages */}
                  <VStack spacing={12}>
                    {exampleMessages.map((message) => (
                      <Message
                        key={message.id}
                        {...message}
                        variant={messageVariant}
                        onCopy={() => console.log('Copy:', message.id)}
                        onReact={(reaction) => console.log('React:', message.id, reaction)}
                        onBookmark={() => console.log('Bookmark:', message.id)}
                        onShare={() => console.log('Share:', message.id)}
                      />
                    ))}
                  </VStack>
                </VStack>
              )}
            </VStack>

            {/* Response Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Response Component
                </RNText>
                <TouchableOpacity onPress={() => setShowResponseDemo(!showResponseDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showResponseDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showResponseDemo && (
                <VStack spacing={12}>
                  <Response
                    content={exampleResponses[0].content}
                    streaming={true}
                    variant="default"
                  />
                </VStack>
              )}
            </VStack>

            {/* Terminal Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Terminal Component (VCR)
                </RNText>
                <TouchableOpacity onPress={() => setShowTerminalDemo(!showTerminalDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showTerminalDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showTerminalDemo && (
                <Terminal
                  recording={exampleRecordings.npmInstall}
                  autoPlay
                  loop
                  showControls
                  showHeader
                />
              )}
            </VStack>

            {/* Artifact Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Artifact Component
                </RNText>
                <TouchableOpacity onPress={() => setShowArtifactDemo(!showArtifactDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showArtifactDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showArtifactDemo && (
                <Artifact
                  artifact={exampleArtifacts[0]}
                  variant="default"
                  onDownload={() => console.log('Download')}
                  onShare={() => console.log('Share')}
                />
              )}
            </VStack>

            {/* Tool Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Tool Component
                </RNText>
                <TouchableOpacity onPress={() => setShowToolDemo(!showToolDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showToolDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showToolDemo && (
                <VStack spacing={12}>
                  {exampleTools.slice(0, 3).map((tool) => (
                    <Tool key={tool.id} tool={tool} variant="default" />
                  ))}
                </VStack>
              )}
            </VStack>

            {/* Actions Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Actions Component
                </RNText>
                <TouchableOpacity onPress={() => setShowActionsDemo(!showActionsDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showActionsDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showActionsDemo && (
                <VStack spacing={12}>
                  <Actions
                    actions={exampleActionGroups.saveCancel}
                    layout="horizontal"
                    variant="default"
                  />
                </VStack>
              )}
            </VStack>

            {/* Progress Notice */}
            <View
              style={[
                styles.notice,
                {
                  backgroundColor: theme.colors.accent.rgb,
                  borderColor: theme.colors.border.rgb,
                },
              ]}
            >
              <RNText style={[styles.noticeTitle, { color: theme.colors.foreground.rgb }]}>
                🎉 Phase 3 Complete!
              </RNText>
              <RNText style={[styles.noticeText, { color: theme.colors.mutedForeground.rgb }]}>
                16 core AI SDK components built with glass effects and iOS-native styling!{'\n\n'}
                ✅ Conversation: Message, Response, Suggestion, Conversation, PromptInput{'\n'}
                ✅ Content: Artifact, Image, Sources, InlineCitation, WebPreview{'\n'}
                ✅ Tools: Tool, Context{'\n'}
                ✅ Actions: Actions, Toolbar, OpenInChat{'\n'}
                ✅ Terminal: Terminal/VCR{'\n\n'}
                All components include glass morphism, multiple variants, and example data!
              </RNText>
            </View>
          </VStack>
        </Host>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  componentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  componentCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  componentName: {
    fontSize: 13,
    fontWeight: '500',
  },
  notice: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
