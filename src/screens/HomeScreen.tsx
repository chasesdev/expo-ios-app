import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text as RNText } from 'react-native';
import { Host, VStack, Text, Button } from '@expo/ui/swift-ui';
import { useTheme } from '../design-system';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.rgb }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Host style={{ padding: 20 }}>
          <VStack spacing={24}>
            {/* Header */}
            <VStack spacing={8}>
              <Text style={{ fontSize: 36, fontWeight: 'bold' }}>
                AI SDK UI
              </Text>
              <Text style={{ fontSize: 16, opacity: 0.7 }}>
                Swift UI Components for AI Applications
              </Text>
            </VStack>

            {/* Quick Stats */}
            <VStack spacing={12}>
              <StatCard title="Base UI Components" value="49" />
              <StatCard title="AI SDK Components" value="30" />
              <StatCard title="Total Components" value="79" />
            </VStack>

            {/* Navigation Cards */}
            <VStack spacing={16}>
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
            </VStack>
          </VStack>
        </Host>
      </ScrollView>
    </View>
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
});
