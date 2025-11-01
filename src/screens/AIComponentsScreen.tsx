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
  Toolbar,
  OpenInChat,
  Terminal,
  InlineCitation,
  Plan,
  Task,
  ChainOfThought,
  Reasoning,
  WorkflowPlanner,
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
  exampleToolbars,
  exampleOpenInChat,
  exampleConversation,
  examplePromptSuggestions,
  ExampleTextWithCitations,
  examplePlans,
  exampleTasks,
  exampleChainOfThought,
  exampleReasoning,
  exampleWorkflow,
} from '../components/ai-sdk';

export function AIComponentsScreen() {
  const theme = useTheme();

  // Demo visibility state
  const [showMessageDemo, setShowMessageDemo] = useState(false);
  const [showResponseDemo, setShowResponseDemo] = useState(false);
  const [showSuggestionDemo, setShowSuggestionDemo] = useState(false);
  const [showConversationDemo, setShowConversationDemo] = useState(false);
  const [showPromptInputDemo, setShowPromptInputDemo] = useState(false);
  const [showArtifactDemo, setShowArtifactDemo] = useState(false);
  const [showImageDemo, setShowImageDemo] = useState(false);
  const [showSourcesDemo, setShowSourcesDemo] = useState(false);
  const [showInlineCitationDemo, setShowInlineCitationDemo] = useState(false);
  const [showWebPreviewDemo, setShowWebPreviewDemo] = useState(false);
  const [showContextDemo, setShowContextDemo] = useState(false);
  const [showTerminalDemo, setShowTerminalDemo] = useState(false);
  const [showToolDemo, setShowToolDemo] = useState(false);
  const [showActionsDemo, setShowActionsDemo] = useState(false);
  const [showToolbarDemo, setShowToolbarDemo] = useState(false);
  const [showOpenInChatDemo, setShowOpenInChatDemo] = useState(false);
  const [showPlanDemo, setShowPlanDemo] = useState(false);
  const [showTaskDemo, setShowTaskDemo] = useState(false);
  const [showChainOfThoughtDemo, setShowChainOfThoughtDemo] = useState(false);
  const [showReasoningDemo, setShowReasoningDemo] = useState(false);
  const [showWorkflowDemo, setShowWorkflowDemo] = useState(false);

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
                30+ components for AI apps - All with interactive demos!
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

            {/* Suggestion Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Suggestion Component
                </RNText>
                <TouchableOpacity onPress={() => setShowSuggestionDemo(!showSuggestionDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showSuggestionDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showSuggestionDemo && (
                <VStack spacing={12}>
                  {exampleSuggestions.map((suggestion) => (
                    <Suggestion
                      key={suggestion.id}
                      {...suggestion}
                      onPress={(id) => console.log('Suggestion pressed:', id)}
                    />
                  ))}
                </VStack>
              )}
            </VStack>

            {/* Conversation Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Conversation Component
                </RNText>
                <TouchableOpacity onPress={() => setShowConversationDemo(!showConversationDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showConversationDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showConversationDemo && (
                <Conversation
                  messages={exampleConversation}
                  variant="default"
                  onMessageAction={(messageId, action) => console.log('Message action:', messageId, action)}
                />
              )}
            </VStack>

            {/* PromptInput Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ PromptInput Component
                </RNText>
                <TouchableOpacity onPress={() => setShowPromptInputDemo(!showPromptInputDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showPromptInputDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showPromptInputDemo && (
                <PromptInput
                  placeholder="Ask me anything..."
                  suggestions={examplePromptSuggestions}
                  onSend={(text) => console.log('Send:', text)}
                  onAttach={() => console.log('Attach file')}
                  variant="default"
                />
              )}
            </VStack>

            {/* Image Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Image Component
                </RNText>
                <TouchableOpacity onPress={() => setShowImageDemo(!showImageDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showImageDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showImageDemo && (
                <VStack spacing={12}>
                  {exampleImages.map((image) => (
                    <AIImage
                      key={image.id}
                      {...image}
                      variant="default"
                      onPress={() => console.log('Image pressed:', image.id)}
                    />
                  ))}
                </VStack>
              )}
            </VStack>

            {/* Sources Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Sources Component
                </RNText>
                <TouchableOpacity onPress={() => setShowSourcesDemo(!showSourcesDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showSourcesDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showSourcesDemo && (
                <Sources
                  sources={exampleSources}
                  variant="default"
                  onSourcePress={(source) => console.log('Source pressed:', source.id)}
                />
              )}
            </VStack>

            {/* InlineCitation Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ InlineCitation Component
                </RNText>
                <TouchableOpacity onPress={() => setShowInlineCitationDemo(!showInlineCitationDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showInlineCitationDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showInlineCitationDemo && (
                <ExampleTextWithCitations />
              )}
            </VStack>

            {/* WebPreview Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ WebPreview Component
                </RNText>
                <TouchableOpacity onPress={() => setShowWebPreviewDemo(!showWebPreviewDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showWebPreviewDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showWebPreviewDemo && (
                <VStack spacing={12}>
                  {exampleWebPreviews.map((preview) => (
                    <WebPreview
                      key={preview.url}
                      {...preview}
                      variant="default"
                      onPress={() => console.log('Web preview pressed:', preview.url)}
                    />
                  ))}
                </VStack>
              )}
            </VStack>

            {/* Context Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Context Component
                </RNText>
                <TouchableOpacity onPress={() => setShowContextDemo(!showContextDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showContextDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showContextDemo && (
                <Context
                  items={exampleContextItems}
                  variant="default"
                  onRemove={(item) => console.log('Remove context:', item.id)}
                />
              )}
            </VStack>

            {/* Toolbar Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Toolbar Component
                </RNText>
                <TouchableOpacity onPress={() => setShowToolbarDemo(!showToolbarDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showToolbarDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showToolbarDemo && (
                <VStack spacing={12}>
                  {exampleToolbars.map((toolbar, idx) => (
                    <Toolbar
                      key={idx}
                      items={toolbar.items}
                      variant={toolbar.variant}
                      onItemPress={(item) => console.log('Toolbar item pressed:', item.id)}
                    />
                  ))}
                </VStack>
              )}
            </VStack>

            {/* OpenInChat Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ OpenInChat Component
                </RNText>
                <TouchableOpacity onPress={() => setShowOpenInChatDemo(!showOpenInChatDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showOpenInChatDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showOpenInChatDemo && (
                <VStack spacing={12}>
                  {exampleOpenInChat.map((item) => (
                    <OpenInChat
                      key={item.id}
                      {...item}
                      onPress={() => console.log('Open in chat:', item.id)}
                    />
                  ))}
                </VStack>
              )}
            </VStack>

            {/* Plan Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Plan Component
                </RNText>
                <TouchableOpacity onPress={() => setShowPlanDemo(!showPlanDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showPlanDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showPlanDemo && (
                <VStack spacing={12}>
                  <Plan
                    plan={examplePlans[0]}
                    variant="default"
                    collapsible
                    onStepPress={(stepId) => console.log('Step pressed:', stepId)}
                  />
                </VStack>
              )}
            </VStack>

            {/* Task Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Task Component
                </RNText>
                <TouchableOpacity onPress={() => setShowTaskDemo(!showTaskDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showTaskDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showTaskDemo && (
                <VStack spacing={12}>
                  {exampleTasks.slice(0, 4).map((task) => (
                    <Task
                      key={task.id}
                      task={task}
                      variant="detailed"
                      onPress={() => console.log('Task pressed:', task.id)}
                      onStatusChange={(status) => console.log('Status changed:', status)}
                    />
                  ))}
                </VStack>
              )}
            </VStack>

            {/* ChainOfThought Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ ChainOfThought Component
                </RNText>
                <TouchableOpacity onPress={() => setShowChainOfThoughtDemo(!showChainOfThoughtDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showChainOfThoughtDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showChainOfThoughtDemo && (
                <ChainOfThought
                  data={exampleChainOfThought[0]}
                  variant="default"
                  collapsible
                  onStepPress={(stepId) => console.log('Step pressed:', stepId)}
                />
              )}
            </VStack>

            {/* Reasoning Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ Reasoning Component
                </RNText>
                <TouchableOpacity onPress={() => setShowReasoningDemo(!showReasoningDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showReasoningDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showReasoningDemo && (
                <Reasoning
                  reasoning={exampleReasoning}
                  variant="default"
                  showTimestamps
                />
              )}
            </VStack>

            {/* WorkflowPlanner Component Demo */}
            <VStack spacing={16}>
              <HStack spacing={12} style={{ alignItems: 'center' }}>
                <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, flex: 1, color: theme.colors.foreground.rgb }}>
                  ✅ WorkflowPlanner Component
                </RNText>
                <TouchableOpacity onPress={() => setShowWorkflowDemo(!showWorkflowDemo)}>
                  <Host
                    modifiers={[
                      { type: 'background', color: theme.colors.primary.rgb },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      {showWorkflowDemo ? 'Hide' : 'Show Demo'}
                    </Text>
                  </Host>
                </TouchableOpacity>
              </HStack>

              {showWorkflowDemo && (
                <VStack spacing={12}>
                  <RNText style={{ fontSize: 13, color: theme.colors.mutedForeground.rgb, lineHeight: 19 }}>
                    Interactive workflow editor with drag-and-drop nodes, connections, pan/zoom.{'\n'}
                    Try adding nodes, dragging them, and connecting tasks!
                  </RNText>
                  <WorkflowPlanner
                    initialWorkflow={exampleWorkflow}
                    editable
                    containerWidth={700}
                    containerHeight={500}
                    onWorkflowChange={(workflow) => console.log('Workflow changed:', workflow)}
                    onNodeSelect={(nodeId) => console.log('Node selected:', nodeId)}
                    onEdgeSelect={(edgeId) => console.log('Edge selected:', edgeId)}
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
                🎉 Complete AI SDK - All 30 Components!
              </RNText>
              <RNText style={[styles.noticeText, { color: theme.colors.mutedForeground.rgb }]}>
                All 30 AI SDK components built with full interactive demos!{'\n\n'}
                ✅ Conversation (5): Message, Response, Suggestion, Conversation, PromptInput{'\n'}
                ✅ Content Display (5): Artifact, Image, Sources, InlineCitation, WebPreview{'\n'}
                ✅ Tools & Context (2): Tool, Context{'\n'}
                ✅ Actions (3): Actions, Toolbar, OpenInChat{'\n'}
                ✅ Terminal (1): Terminal/VCR with playback controls{'\n'}
                ✅ Planning & Tasks (4): Plan, Task, ChainOfThought, Reasoning{'\n'}
                ✅ Workflow Editor (10+): Complete interactive workflow with drag-drop nodes, edges, pan/zoom{'\n\n'}
                Features: Glass morphism, multiple variants, example data, full interactivity!
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
