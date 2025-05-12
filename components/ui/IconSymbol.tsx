import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Simplified IconSymbol component that just renders text
// This is a placeholder until proper icons are implemented
export function IconSymbol({
  name,
  size = 24,
  color,
}: {
  name: string;
  size?: number;
  color: string;
}) {
  // Map icon names to simple text representations
  const getIconText = () => {
    switch (name) {
      case 'plus':
        return '+';
      case 'pencil':
        return '✏️';
      case 'trash':
        return '🗑️';
      case 'chevron.left':
        return '←';
      case 'arrow.right.circle':
        return '→';
      case 'house.fill':
        return '🏠';
      case 'list.bullet':
        return '📋';
      case 'wrench.fill':
        return '🔧';
      case 'car.fill':
        return '🚗';
      default:
        return '•';
    }
  };

  return (
    <Text
      style={[
        styles.icon,
        {
          color,
          fontSize: size,
        },
      ]}
    >
      {getIconText()}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontWeight: 'bold',
  },
});
