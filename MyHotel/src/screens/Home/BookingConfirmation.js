import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const successImage = require('../../../assets/images/12-Booking success Page/Path.png');
const defaultHotelImage = require('../../../assets/images/07-My Booking Page/image-1-35.png');

function getHotelImageSource(hotel) {
  if (hotel && hotel.localImage) return hotel.localImage;
  return defaultHotelImage;
}

const BookingConfirmation = ({ route, navigation }) => {
  const { booking, hotel } = route.params;

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Explore' }],
    });
  };

  const handleViewBookings = () => {
    navigation.navigate('Profile');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <Image source={successImage} style={styles.successGraphic} />

      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.subtitle}>
        Your booking at {hotel.name} has been successfully confirmed
      </Text>

      
      <View style={styles.bookingCard}>
        <Image source={getHotelImageSource(hotel)} style={styles.hotelImage} />
        
        <View style={styles.bookingDetails}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
          
          <View style={styles.bookingInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Check-in</Text>
              <Text style={styles.infoValue}>
                {new Date(booking.checkIn).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Check-out</Text>
              <Text style={styles.infoValue}>
                {new Date(booking.checkOut).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>
                {booking.nights} night{booking.nights > 1 ? 's' : ''}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rooms</Text>
              <Text style={styles.infoValue}>{booking.rooms}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Guests</Text>
              <Text style={styles.infoValue}>{booking.guests}</Text>
            </View>
          </View>

          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalPrice}>${booking.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      
      <View style={styles.bookingIdContainer}>
        <Text style={styles.bookingIdLabel}>Booking Reference</Text>
        <Text style={styles.bookingId}>#{booking.id.slice(-8).toUpperCase()}</Text>
      </View>

      
      <View style={styles.nextSteps}>
        <Text style={styles.nextStepsTitle}>What's Next?</Text>
        <Text style={styles.nextStepsText}>
          • You will receive a confirmation email shortly{'\n'}
          • Check-in time is from 3:00 PM{'\n'}
          • Free cancellation up to 24 hours before check-in{'\n'}
          • Contact the hotel for any special requests
        </Text>
      </View>

      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleBackToHome}
        >
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleViewBookings}
        >
          <Text style={styles.secondaryButtonText}>View My Bookings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  successGraphic: {
    width: 80,
    height: 80,
    marginBottom: 24,
    tintColor: '#4CAF50',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  bookingCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    width: '100%',
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  bookingDetails: {
    padding: 20,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  bookingInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookingIdContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bookingIdLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },
  nextSteps: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
    width: '100%',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  nextStepsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingConfirmation;