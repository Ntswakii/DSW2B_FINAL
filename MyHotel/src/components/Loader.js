import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const Loader = ({ size = 'large', color = '#007AFF', text = '' }) => {
  const normalizeSize = (value) => {
    if (typeof value === 'number') return value;
    if (value === 'small') return 20;
    if (value === 'large') return 36;
    return 28; // default fallback
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size={normalizeSize(size)} color={color} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default Loader;