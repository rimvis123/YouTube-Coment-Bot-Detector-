
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

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

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBorderColor = () => {
    if (comment.isBot) {
      return colors.danger;
    }
    return colors.border;
  };

  const getBackgroundColor = () => {
    if (comment.isBot) {
      return '#ffebee'; // Light red background for bot comments
    }
    return colors.card;
  };

  return (
    <View style={[
      styles.container,
      {
        borderLeftColor: getBorderColor(),
        backgroundColor: getBackgroundColor(),
      }
    ]}>
      <View style={styles.header}>
        <Image
          source={{ uri: comment.authorProfileImageUrl }}
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{comment.authorDisplayName}</Text>
          <Text style={styles.timestamp}>{formatDate(comment.publishedAt)}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(comment.id)}
        >
          <IconSymbol name="trash" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <Text style={styles.commentText}>{comment.textDisplay}</Text>

      <View style={styles.footer}>
        <View style={styles.likeContainer}>
          <IconSymbol name="heart" size={16} color={colors.textSecondary} />
          <Text style={styles.likeCount}>{comment.likeCount}</Text>
        </View>

        {comment.isBot && (
          <View style={styles.botIndicator}>
            <IconSymbol name="exclamationmark.triangle" size={16} color={colors.danger} />
            <Text style={styles.botScore}>Bot Score: {comment.botScore}%</Text>
          </View>
        )}
      </View>

      {comment.isBot && comment.botReasons && comment.botReasons.length > 0 && (
        <View style={styles.botReasons}>
          <Text style={styles.botReasonsTitle}>Detection Reasons:</Text>
          {comment.botReasons.map((reason, index) => (
            <Text key={index} style={styles.botReason}>• {reason}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  botIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  botScore: {
    fontSize: 12,
    color: colors.card,
    fontWeight: '600',
    marginLeft: 4,
  },
  botReasons: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ffcdd2',
    borderRadius: 6,
  },
  botReasonsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
    marginBottom: 4,
  },
  botReason: {
    fontSize: 11,
    color: colors.danger,
    lineHeight: 16,
  },
});
