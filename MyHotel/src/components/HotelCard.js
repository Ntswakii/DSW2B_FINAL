import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const defaultHotelImage = require('../../assets/images/06-Explore Page/image-1.png');

function getHotelImageSource(hotel) {
  // Prefer local image if provided; otherwise fallback to default asset
  if (hotel && hotel.localImage) {
    return hotel.localImage;
  }
  return defaultHotelImage;
}

const HotelCard = ({ hotel, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={getHotelImageSource(hotel)} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{hotel.name}</Text>
        <Text style={styles.location}>📍 {hotel.location}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {hotel.rating}</Text>
          <Text style={styles.price}>${hotel.price}/night</Text>
        </View>
        {hotel.amenities && (
          <Text style={styles.amenities}>
            {hotel.amenities.slice(0, 3).join(' • ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontWeight: 'bold',
    color: '#FF9529',
  },
  price: {
    fontWeight: 'bold',
    color: '#007AFF',
    fontSize: 16,
  },
  amenities: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },
});

export default HotelCard;