import React from 'react';
import { View, StyleSheet, ScrollView, Text as RNText, TouchableOpacity, Linking } from 'react-native';
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
          <View style={{ gap: 48 }}>
            {/* Header with View All Link */}
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ gap: 4, flex: 1 }}>
                <RNText style={{ fontSize: 28, fontWeight: '600' }}>
                  AI SDK Components
                </RNText>
                <RNText style={{ fontSize: 14, opacity: 0.7 }}>
                  Interactive demos for all 30+ AI components
                </RNText>
              </View>
              <TouchableOpacity onPress={() => console.log('View all')}>
                <RNText style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary.rgb }}>
                  View All Components
                </RNText>
              </TouchableOpacity>
            </View>

            {/* Workflow Planner */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Workflow Planner
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Interactive workflow visualization with drag-and-drop nodes
              </RNText>
              <WorkflowPlanner
                initialWorkflow={exampleWorkflow}
                editable
                containerWidth={350}
                containerHeight={500}
                onWorkflowChange={(workflow) => console.log('Workflow changed:', workflow)}
                onNodeSelect={(nodeId) => console.log('Node selected:', nodeId)}
                onEdgeSelect={(edgeId) => console.log('Edge selected:', edgeId)}
              />
            </View>

            {/* AI Chatbot */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                AI Chatbot
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Full-featured conversation interface with message history
              </RNText>
              <View style={{ gap: 12 }}>
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
              </View>
            </View>

            {/* Terminal Component */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Terminal (VCR)
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Terminal recording playback with controls
              </RNText>
              <Terminal
                recording={exampleRecordings.npmInstall}
                autoPlay
                loop
                showControls
                showHeader
              />
            </View>

            {/* Plan Component */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Plan
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Multi-step plan visualization with progress tracking
              </RNText>
              <Plan
                plan={examplePlans[0]}
                variant="default"
                collapsible
                onStepPress={(stepId) => console.log('Step pressed:', stepId)}
              />
            </View>

            {/* Task Component */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Task
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Individual task items with status and actions
              </RNText>
              <View style={{ gap: 12 }}>
                {exampleTasks.slice(0, 3).map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    variant="detailed"
                    onPress={() => console.log('Task pressed:', task.id)}
                    onStatusChange={(status) => console.log('Status changed:', status)}
                  />
                ))}
              </View>
            </View>

            {/* Message Component */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Message
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Individual message bubbles with actions and reactions
              </RNText>
              <View style={{ gap: 12 }}>
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
              </View>
            </View>

            {/* Artifact Component */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Artifact
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Code artifacts with syntax highlighting and actions
              </RNText>
              <Artifact
                artifact={exampleArtifacts[0]}
                variant="default"
                onDownload={() => console.log('Download')}
                onShare={() => console.log('Share')}
              />
            </View>

            {/* Tool Component */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Tool
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Tool execution displays with status and results
              </RNText>
              <View style={{ gap: 12 }}>
                {exampleTools.slice(0, 2).map((tool) => (
                  <Tool key={tool.id} tool={tool} variant="default" />
                ))}
              </View>
            </View>

            {/* AI Image Component */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                AI Image
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                AI-generated image display with metadata
              </RNText>
              <View style={{ gap: 12 }}>
                {exampleImages.slice(0, 1).map((image) => (
                  <AIImage
                    key={image.id}
                    {...image}
                    variant="default"
                    onPress={() => console.log('Image pressed:', image.id)}
                  />
                ))}
              </View>
            </View>

            {/* Sources Component */}
            <View style={{ gap: 12 }}>
              <RNText style={[styles.componentTitle, { color: theme.colors.foreground.rgb }]}>
                Sources
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                Source citations and references
              </RNText>
              <Sources
                sources={exampleSources}
                variant="default"
                onSourcePress={(source) => console.log('Source pressed:', source.id)}
              />
            </View>

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
          </View>
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
