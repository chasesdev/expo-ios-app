import React from 'react';
import { View, StyleSheet, ScrollView, Text as RNText, TouchableOpacity, Linking } from 'react-native';
import { VStack, Text, HStack } from '@expo/ui/swift-ui';
import { Host } from '../components/common/SwiftUIHost';
import { useTheme } from '../design-system';
import {
  Message,
  Conversation,
  PromptInput,
  Artifact,
  AIImage,
  Sources,
  Tool,
  Terminal,
  Plan,
  Task,
  WorkflowPlanner,
  exampleMessages,
  exampleArtifacts,
  exampleImages,
  exampleSources,
  exampleTools,
  exampleRecordings,
  exampleConversation,
  examplePromptSuggestions,
  examplePlans,
  exampleTasks,
  exampleWorkflow,
} from '../components/ai-sdk';

export function AIComponentsScreen() {
  const theme = useTheme();
  const [promptValue, setPromptValue] = React.useState('');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.rgb }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Host style={{ padding: 20 }}>
          <VStack spacing={48}>
            {/* Header with View All Link */}
            <HStack spacing={12} style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <VStack spacing={4} style={{ flex: 1 }}>
                <Text style={{ fontSize: 28, fontWeight: '600' }}>
                  AI SDK Components
                </Text>
                <Text style={{ fontSize: 14, opacity: 0.7 }}>
                  Interactive demos for all 30+ AI components
                </Text>
              </VStack>
              <TouchableOpacity onPress={() => console.log('View all')}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary.rgb }}>
                  View All Components
                </Text>
              </TouchableOpacity>
            </HStack>

            {/* Workflow Planner */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Workflow Planner
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Interactive workflow visualization with drag-and-drop nodes
              </Text>
              <WorkflowPlanner
                initialWorkflow={exampleWorkflow}
                editable
                containerWidth={350}
                containerHeight={500}
                onWorkflowChange={(workflow) => console.log('Workflow changed:', workflow)}
                onNodeSelect={(nodeId) => console.log('Node selected:', nodeId)}
                onEdgeSelect={(edgeId) => console.log('Edge selected:', edgeId)}
              />
            </VStack>

            {/* AI Chatbot */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                AI Chatbot
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Full-featured conversation interface with message history
              </Text>
              <VStack spacing={12}>
                <PromptInput
                  value={promptValue}
                  onChange={setPromptValue}
                  placeholder="Start a conversation"
                  suggestions={examplePromptSuggestions.slice(0, 3)}
                  onSend={(text) => {
                    console.log('Send:', text);
                    setPromptValue('');
                  }}
                />
                <Conversation
                  messages={exampleConversation.slice(0, 3)}
                  variant="default"
                  onMessageAction={(messageId, action) => console.log('Message action:', messageId, action)}
                />
              </VStack>
            </VStack>

            {/* Terminal Component */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Terminal (VCR)
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Terminal recording playback with controls
              </Text>
              <Terminal
                recording={exampleRecordings.npmInstall}
                autoPlay
                loop
                showControls
                showHeader
              />
            </VStack>

            {/* Plan Component */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Plan
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Multi-step plan visualization with progress tracking
              </Text>
              <Plan
                plan={examplePlans[0]}
                variant="default"
                collapsible
                onStepPress={(stepId) => console.log('Step pressed:', stepId)}
              />
            </VStack>

            {/* Task Component */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Task
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Individual task items with status and actions
              </Text>
              <VStack spacing={12}>
                {exampleTasks.slice(0, 3).map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    variant="detailed"
                    onPress={() => console.log('Task pressed:', task.id)}
                    onStatusChange={(status) => console.log('Status changed:', status)}
                  />
                ))}
              </VStack>
            </VStack>

            {/* Message Component */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Message
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Individual message bubbles with actions and reactions
              </Text>
              <VStack spacing={12}>
                {exampleMessages.slice(0, 2).map((message) => (
                  <Message
                    key={message.id}
                    {...message}
                    variant="default"
                    onCopy={() => console.log('Copy:', message.id)}
                    onReact={(reaction) => console.log('React:', message.id, reaction)}
                    onBookmark={() => console.log('Bookmark:', message.id)}
                    onShare={() => console.log('Share:', message.id)}
                  />
                ))}
              </VStack>
            </VStack>

            {/* Artifact Component */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Artifact
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Code artifacts with syntax highlighting and actions
              </Text>
              <Artifact
                artifact={exampleArtifacts[0]}
                variant="default"
                onDownload={() => console.log('Download')}
                onShare={() => console.log('Share')}
              />
            </VStack>

            {/* Tool Component */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Tool
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Tool execution displays with status and results
              </Text>
              <VStack spacing={12}>
                {exampleTools.slice(0, 2).map((tool) => (
                  <Tool key={tool.id} tool={tool} variant="default" />
                ))}
              </VStack>
            </VStack>

            {/* AI Image Component */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                AI Image
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                AI-generated image display with metadata
              </Text>
              <VStack spacing={12}>
                {exampleImages.slice(0, 1).map((image) => (
                  <AIImage
                    key={image.id}
                    {...image}
                    variant="default"
                    onPress={() => console.log('Image pressed:', image.id)}
                  />
                ))}
              </VStack>
            </VStack>

            {/* Sources Component */}
            <VStack spacing={12}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Sources
              </RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Source citations and references
              </Text>
              <Sources
                sources={exampleSources}
                variant="default"
                onSourcePress={(source) => console.log('Source pressed:', source.id)}
              />
            </VStack>

            {/* Component Count Footer */}
            <View
              style={[
                styles.footer,
                {
                  backgroundColor: theme.colors.muted.rgb,
                  borderColor: theme.colors.border.rgb,
                },
              ]}
            >
              <RNText style={[styles.footerTitle, { color: theme.colors.foreground.rgb }]}>
                30+ AI SDK Components
              </RNText>
              <RNText style={[styles.footerText, { color: theme.colors.mutedForeground.rgb }]}>
                Complete component library for building AI-powered apps with React Native and SwiftUI.
                {'\n\n'}
                ✓ Conversation UI • Terminal • Workflow • Planning • Content Display
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
  componentTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  footer: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
