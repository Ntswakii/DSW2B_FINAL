import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const RatingStars = ({ rating, onRatingChange, editable = false, size = 20 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => editable && onRatingChange(star)}
          disabled={!editable}
        >
          <Text style={[styles.star, { fontSize: size }]}>
            {star <= rating ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
});

export default RatingStars;