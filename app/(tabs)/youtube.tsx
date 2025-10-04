
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { CommentItem } from '@/components/CommentItem';
import { YouTubeAuth } from '@/components/YouTubeAuth';

interface Comment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  publishedAt: string;
  likeCount: number;
  isBot?: boolean;
  botScore?: number;
  botReasons?: string[];
}

export default function YouTubeScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const extractVideoId = (url: string): string | null => {
    console.log('Extracting video ID from URL:', url);
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const detectBot = (comment: Comment): { isBot: boolean; score: number; reasons: string[] } => {
    console.log('Analyzing comment for bot detection:', comment.textDisplay);
    const reasons: string[] = [];
    let score = 0;

    // Check for spam patterns
    const spamKeywords = ['subscribe', 'follow me', 'check out my channel', 'click here', 'free money', 'earn money'];
    const hasSpamKeywords = spamKeywords.some(keyword => 
      comment.textDisplay.toLowerCase().includes(keyword.toLowerCase())
    );
    if (hasSpamKeywords) {
      score += 30;
      reasons.push('Contains spam keywords');
    }

    // Check for excessive emojis
    const emojiCount = (comment.textDisplay.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
    if (emojiCount > 5) {
      score += 20;
      reasons.push('Excessive emoji usage');
    }

    // Check for repeated characters
    const hasRepeatedChars = /(.)\1{4,}/.test(comment.textDisplay);
    if (hasRepeatedChars) {
      score += 25;
      reasons.push('Repeated characters pattern');
    }

    // Check for suspicious username patterns
    const suspiciousNamePatterns = /^[a-zA-Z]+\d{4,}$|^[a-zA-Z]{1,3}\d+$/;
    if (suspiciousNamePatterns.test(comment.authorDisplayName)) {
      score += 15;
      reasons.push('Suspicious username pattern');
    }

    // Check for all caps
    const isAllCaps = comment.textDisplay === comment.textDisplay.toUpperCase() && comment.textDisplay.length > 10;
    if (isAllCaps) {
      score += 20;
      reasons.push('All caps text');
    }

    // Check for external links
    const hasLinks = /https?:\/\//.test(comment.textDisplay);
    if (hasLinks) {
      score += 25;
      reasons.push('Contains external links');
    }

    return {
      isBot: score >= 40,
      score,
      reasons
    };
  };

  const fetchComments = async (videoId: string) => {
    console.log('Fetching comments for video ID:', videoId);
    setLoading(true);
    
    try {
      // Simulate API call with mock data for demonstration
      // In a real app, you would use the YouTube Data API
      const mockComments: Comment[] = [
        {
          id: '1',
          authorDisplayName: 'John Smith',
          authorProfileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          textDisplay: 'Great video! Really helpful content.',
          publishedAt: '2024-01-15T10:30:00Z',
          likeCount: 5,
        },
        {
          id: '2',
          authorDisplayName: 'SpamBot123',
          authorProfileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
          textDisplay: 'SUBSCRIBE TO MY CHANNEL FOR FREE MONEY!!! 💰💰💰💰💰💰 CLICK HERE NOW!!!',
          publishedAt: '2024-01-15T09:15:00Z',
          likeCount: 0,
        },
        {
          id: '3',
          authorDisplayName: 'Alice Johnson',
          authorProfileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          textDisplay: 'Thanks for sharing this information. Very useful!',
          publishedAt: '2024-01-15T08:45:00Z',
          likeCount: 12,
        },
        {
          id: '4',
          authorDisplayName: 'Bot4567',
          authorProfileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          textDisplay: 'Check out my channel for amazing content!!!! Follow me now and earn money from home! https://suspicious-link.com',
          publishedAt: '2024-01-15T07:20:00Z',
          likeCount: 1,
        },
        {
          id: '5',
          authorDisplayName: 'Mike Wilson',
          authorProfileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
          textDisplay: 'Interesting perspective on this topic. I learned something new today.',
          publishedAt: '2024-01-15T06:10:00Z',
          likeCount: 8,
        },
      ];

      // Apply bot detection to each comment
      const commentsWithBotDetection = mockComments.map(comment => {
        const botAnalysis = detectBot(comment);
        return {
          ...comment,
          isBot: botAnalysis.isBot,
          botScore: botAnalysis.score,
          botReasons: botAnalysis.reasons,
        };
      });

      setComments(commentsWithBotDetection);
      console.log('Comments loaded with bot detection:', commentsWithBotDetection.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to fetch comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadComments = () => {
    console.log('Load comments button pressed');
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      Alert.alert('Invalid URL', 'Please enter a valid YouTube video URL');
      return;
    }
    fetchComments(videoId);
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log('Attempting to delete comment:', commentId);
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, you would call the YouTube API to delete the comment
              // For now, we'll just remove it from the local state
              setComments(prev => prev.filter(comment => comment.id !== commentId));
              Alert.alert('Success', 'Comment deleted successfully');
              console.log('Comment deleted successfully:', commentId);
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAuthSuccess = (token: string) => {
    console.log('Authentication successful');
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const botComments = comments.filter(comment => comment.isBot);
  const regularComments = comments.filter(comment => !comment.isBot);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={commonStyles.container}>
        {Platform.OS === 'ios' && (
          <Stack.Screen
            options={{
              title: 'YouTube Moderation',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
            }}
          />
        )}
        <YouTubeAuth onAuthSuccess={handleAuthSuccess} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'YouTube Moderation',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
      )}
      
      <ScrollView style={commonStyles.content}>
        <Text style={commonStyles.title}>YouTube Comment Moderator</Text>
        <Text style={commonStyles.textSecondary}>
          Enter a YouTube video URL to analyze comments for potential bots
        </Text>

        <View style={{ marginVertical: 20 }}>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter YouTube video URL..."
            placeholderTextColor={colors.textSecondary}
            value={videoUrl}
            onChangeText={setVideoUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity
            style={[buttonStyles.primary, { marginTop: 12 }]}
            onPress={handleLoadComments}
            disabled={loading || !videoUrl.trim()}
          >
            {loading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <Text style={commonStyles.buttonText}>Load Comments</Text>
            )}
          </TouchableOpacity>
        </View>

        {comments.length > 0 && (
          <View>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <View style={commonStyles.center}>
                <Text style={commonStyles.subtitle}>Total Comments</Text>
                <Text style={[commonStyles.text, { color: colors.accent }]}>
                  {comments.length}
                </Text>
              </View>
              <View style={commonStyles.center}>
                <Text style={commonStyles.subtitle}>Bot Comments</Text>
                <Text style={[commonStyles.text, { color: colors.danger }]}>
                  {botComments.length}
                </Text>
              </View>
              <View style={commonStyles.center}>
                <Text style={commonStyles.subtitle}>Clean Comments</Text>
                <Text style={[commonStyles.text, { color: colors.success }]}>
                  {regularComments.length}
                </Text>
              </View>
            </View>

            {botComments.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={[commonStyles.subtitle, { color: colors.danger }]}>
                  🤖 Potential Bot Comments ({botComments.length})
                </Text>
                {botComments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </View>
            )}

            {regularComments.length > 0 && (
              <View>
                <Text style={[commonStyles.subtitle, { color: colors.success }]}>
                  ✅ Regular Comments ({regularComments.length})
                </Text>
                {regularComments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
