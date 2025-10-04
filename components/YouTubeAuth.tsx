
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface YouTubeAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

export function YouTubeAuth({ onAuthSuccess }: YouTubeAuthProps) {
  const [loading, setLoading] = useState(false);

  // Note: In a real app, you would need to:
  // 1. Set up OAuth 2.0 credentials in Google Cloud Console
  // 2. Configure the YouTube Data API
  // 3. Add proper redirect URIs
  // 4. Handle refresh tokens for long-term access

  const handleAuthenticate = async () => {
    console.log('Starting YouTube authentication process');
    setLoading(true);

    try {
      // For demonstration purposes, we'll simulate the auth flow
      // In a real app, you would use the actual YouTube OAuth flow
      
      Alert.alert(
        'Authentication Required',
        'To use this app with real YouTube data, you need to:\n\n' +
        '1. Set up a Google Cloud Project\n' +
        '2. Enable YouTube Data API v3\n' +
        '3. Configure OAuth 2.0 credentials\n' +
        '4. Add proper redirect URIs\n\n' +
        'For now, we\'ll use demo mode with sample data.',
        [
          {
            text: 'Continue with Demo',
            onPress: () => {
              // Simulate successful authentication
              setTimeout(() => {
                console.log('Demo authentication successful');
                onAuthSuccess('demo_token');
                setLoading(false);
              }, 1000);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setLoading(false),
          },
        ]
      );
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Authentication Error', 'Failed to authenticate with YouTube. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.content}>
      <View style={commonStyles.center}>
        <IconSymbol 
          name="play.rectangle.fill" 
          size={80} 
          color={colors.primary} 
          style={{ marginBottom: 24 }}
        />
        
        <Text style={commonStyles.title}>YouTube Comment Moderator</Text>
        
        <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 32 }]}>
          Authenticate with your YouTube account to start moderating comments and detecting bots.
        </Text>

        <View style={{ width: '100%', maxWidth: 300 }}>
          <TouchableOpacity
            style={[buttonStyles.primary, { marginBottom: 16 }]}
            onPress={handleAuthenticate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <>
                <IconSymbol name="person.badge.key" size={20} color={colors.card} />
                <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>
                  Connect YouTube Account
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ padding: 16, backgroundColor: '#e3f2fd', borderRadius: 8 }}>
            <Text style={[commonStyles.textSecondary, { fontSize: 12, textAlign: 'center' }]}>
              🔒 Your data is secure. We only request permissions to read and manage comments on your videos.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 40 }}>
        <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 16 }]}>
          Features
        </Text>
        
        <View style={{ gap: 12 }}>
          <FeatureItem
            icon="magnifyingglass"
            title="Bot Detection"
            description="Advanced algorithms to identify potential bot comments"
          />
          <FeatureItem
            icon="trash"
            title="Quick Moderation"
            description="Delete suspicious comments with a single tap"
          />
          <FeatureItem
            icon="chart.bar"
            title="Analytics"
            description="View statistics about bot activity on your videos"
          />
          <FeatureItem
            icon="shield.checkered"
            title="Safe & Secure"
            description="Your account data is protected and never stored"
          />
        </View>
      </View>
    </View>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <IconSymbol name={icon as any} size={20} color={colors.card} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 2 }]}>
          {title}
        </Text>
        <Text style={commonStyles.textSecondary}>
          {description}
        </Text>
      </View>
    </View>
  );
}
