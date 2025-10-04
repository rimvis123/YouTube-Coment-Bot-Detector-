
import React from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, commonStyles } from "@/styles/commonStyles";
import { router } from "expo-router";

export default function HomeScreen() {
  const handleNavigateToYouTube = () => {
    console.log('Navigating to YouTube moderation');
    router.push('/(tabs)/youtube');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "YouTube Moderator",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.hero}>
          <IconSymbol 
            name="play.rectangle.fill" 
            size={100} 
            color={colors.primary} 
            style={{ marginBottom: 24 }}
          />
          
          <Text style={styles.title}>YouTube Comment Moderator</Text>
          <Text style={styles.subtitle}>
            Detect and manage bot comments on your YouTube videos with advanced AI-powered analysis.
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureCard
            icon="magnifyingglass.circle"
            title="Smart Detection"
            description="Identify spam, bots, and suspicious comments automatically"
            color={colors.accent}
          />
          
          <FeatureCard
            icon="trash.circle"
            title="Quick Actions"
            description="Delete unwanted comments with a single tap"
            color={colors.danger}
          />
          
          <FeatureCard
            icon="chart.pie"
            title="Analytics"
            description="View detailed statistics about your comment moderation"
            color={colors.secondary}
          />
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleNavigateToYouTube}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <IconSymbol name="arrow.right" size={20} color={colors.card} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <View style={[styles.featureCard, commonStyles.card]}>
      <View style={[styles.featureIcon, { backgroundColor: color }]}>
        <IconSymbol name={icon as any} size={24} color={colors.card} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    flex: 2,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.card,
  },
});
