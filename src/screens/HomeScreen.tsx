import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Dimensions, Text as RNText, ActivityIndicator } from 'react-native';
import { Button, Text } from '@expo/ui/swift-ui';
import { Host } from '../components/common/SwiftUIHost';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useTheme } from '../design-system';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const workflowWidth = Math.min(screenWidth - 40, 750); // Use 90% of screen width, max 750px

  // Lazy load WorkflowPlanner on demand
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [WorkflowComponent, setWorkflowComponent] = useState<any>(null);
  const [exampleWorkflow, setExampleWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadWorkflow = async () => {
    if (!WorkflowComponent) {
      setLoading(true);
      try {
        const module = await import('../components/ai-sdk/workflow');
        setWorkflowComponent(() => module.WorkflowPlanner);
        setExampleWorkflow(module.exampleWorkflow);
        setShowWorkflow(true);
      } finally {
        setLoading(false);
      }
    } else {
      setShowWorkflow(true);
    }
  };

  return (
    <ErrorBoundary>
      <View style={[styles.container, { backgroundColor: theme.colors.background.rgb }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Host style={{ padding: 20 }}>
            <View style={{ gap: 24 }}>
            {/* Header */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 36, fontWeight: 'bold' }}>
                AI SDK UI
              </Text>
              <Text style={{ fontSize: 16, opacity: 0.7 }}>
                Swift UI Components for AI Applications
              </Text>
            </View>

            {/* Workflow Planner Demo */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 24, fontWeight: '600' }}>
                Interactive Workflow Planner
              </Text>
              <Text style={{ fontSize: 14, opacity: 0.7 }}>
                Drag nodes, zoom, pan, and create connections. {showWorkflow ? 'Try the example workflow below!' : 'Click below to load the interactive demo.'}
              </Text>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary.rgb} />
                  <RNText style={{ color: theme.colors.mutedForeground.rgb, marginTop: 12 }}>
                    Loading workflow planner...
                  </RNText>
                </View>
              ) : !showWorkflow ? (
                <Pressable
                  onPress={loadWorkflow}
                  style={({ pressed }) => [
                    styles.loadButton,
                    {
                      backgroundColor: theme.colors.primary.rgb,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <RNText style={styles.loadButtonText}>
                    Load Workflow Planner (Optimized for Performance)
                  </RNText>
                </Pressable>
              ) : WorkflowComponent && exampleWorkflow ? (
                <WorkflowComponent
                  initialWorkflow={exampleWorkflow}
                  editable={true}
                  containerWidth={workflowWidth}
                  containerHeight={600}
                  onWorkflowChange={(workflow: any) => console.log('Workflow changed:', workflow)}
                />
              ) : null}
            </View>

            {/* Quick Stats */}
            <View style={{ gap: 12 }}>
              <StatCard title="Base UI Components" value="49" />
              <StatCard title="AI SDK Components" value="30" />
              <StatCard title="Total Components" value="79" />
            </View>

            {/* Navigation Cards */}
            <View style={{ gap: 16 }}>
              <NavigationCard
                title="Design System"
                description="Colors, typography, spacing, and design tokens"
                onPress={() => navigation.navigate('DesignSystem')}
              />
              <NavigationCard
                title="Base UI Components"
                description="Buttons, inputs, cards, and foundational components"
                onPress={() => navigation.navigate('BaseComponents')}
              />
              <NavigationCard
                title="AI SDK Components"
                description="Message, Conversation, Canvas, Plan, and AI-specific components"
                onPress={() => navigation.navigate('AIComponents')}
              />
            </View>
          </View>
        </Host>
      </ScrollView>
    </View>
    </ErrorBoundary>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.colors.card.rgb,
          borderColor: theme.colors.border.rgb,
        },
      ]}
    >
      <RNText style={[styles.statValue, { color: theme.colors.primary.rgb }]}>
        {value}
      </RNText>
      <RNText style={[styles.statTitle, { color: theme.colors.mutedForeground.rgb }]}>
        {title}
      </RNText>
    </View>
  );
}

function NavigationCard({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navCard,
        {
          backgroundColor: theme.colors.card.rgb,
          borderColor: theme.colors.border.rgb,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <RNText style={[styles.navTitle, { color: theme.colors.foreground.rgb }]}>
        {title}
      </RNText>
      <RNText style={[styles.navDescription, { color: theme.colors.mutedForeground.rgb }]}>
        {description}
      </RNText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  statCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statTitle: {
    fontSize: 14,
    marginTop: 4,
  },
  navCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  navDescription: {
    fontSize: 14,
  },
  loadButton: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  loadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
});
