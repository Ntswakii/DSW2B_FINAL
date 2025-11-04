import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Image
} from 'react-native';
import { bookingService } from '../../services/databaseService';
import { getDaysBetween } from '../../utils/dateHelper';
import { validateBookingDates } from '../../utils/validators';
import Loader from '../../components/Loader';

const Booking = ({ route, navigation }) => {
  const { hotel } = route.params;
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [checkInText, setCheckInText] = useState(() => formatDateYYYYMMDD(new Date()));
  const [checkOutText, setCheckOutText] = useState(() => formatDateYYYYMMDD(new Date(Date.now() + 86400000)));
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const nights = getDaysBetween(checkIn, checkOut);
  const subtotal = hotel.price * nights * rooms;
  const serviceFee = subtotal * 0.1; 
  const total = subtotal + serviceFee;

  function formatDateYYYYMMDD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseDateYYYYMMDD(text) {
    const match = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(text);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    const date = new Date(Date.UTC(year, month - 1, day));
    
    const local = new Date(year, month - 1, day);
    if (isNaN(date.getTime()) || isNaN(local.getTime())) return null;
    
    if (local.getFullYear() !== year || local.getMonth() !== month - 1 || local.getDate() !== day) return null;
    return local;
  }

  const onChangeCheckInText = (text) => {
    setCheckInText(text);
    const parsed = parseDateYYYYMMDD(text);
    if (!parsed) return;
    const today = new Date();
    today.setHours(0,0,0,0);
    if (parsed < today) {
      return;
    }
    setCheckIn(parsed);
    if (checkOut <= parsed) {
      const nextDay = new Date(parsed.getTime() + 86400000);
      setCheckOut(nextDay);
      setCheckOutText(formatDateYYYYMMDD(nextDay));
    }
  };

  const onChangeCheckOutText = (text) => {
    setCheckOutText(text);
    const parsed = parseDateYYYYMMDD(text);
    if (!parsed) return;
    if (parsed <= checkIn) {
      return;
    }
    setCheckOut(parsed);
  };

  const validateBooking = () => {
    if (!validateBookingDates(checkIn, checkOut)) {
      Alert.alert('Error', 'Check-out date must be after check-in date');
      return false;
    }
    if (rooms < 1) {
      Alert.alert('Error', 'Please select at least 1 room');
      return false;
    }
    if (guests < 1) {
      Alert.alert('Error', 'Please select at least 1 guest');
      return false;
    }
    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    try {
      const bookingData = {
        hotel: {
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          image: hotel.image,
          price: hotel.price,
        },
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        nights,
        rooms,
        guests,
        subtotal,
        serviceFee,
        total,
        specialRequests: specialRequests.trim(),
      };

      await bookingService.createBooking(bookingData);
      
      navigation.navigate('BookingConfirmation', { 
        booking: { ...bookingData, id: Date.now().toString() },
        hotel 
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader text="Processing your booking..." />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.hotelSummary}>
        <Image
          source={require('../../../assets/images/07-My Booking Page/room.png')}
          style={styles.hotelImage}
          resizeMode="cover"
        />
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.hotelLocation}>{hotel.location}</Text>
        <Text style={styles.hotelPrice}>${hotel.price}/night</Text>
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>

        
        <View style={styles.dateContainer}>
          <View style={styles.dateField}>
            <Text style={styles.label}>Check-in (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.dateButton}
              value={checkInText}
              onChangeText={onChangeCheckInText}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.dateField}>
            <Text style={styles.label}>Check-out (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.dateButton}
              value={checkOutText}
              onChangeText={onChangeCheckOutText}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        
        <View style={styles.selectorContainer}>
          <View style={styles.selector}>
            <Text style={styles.label}>Rooms</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setRooms(Math.max(1, rooms - 1))}
              >
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{rooms}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setRooms(rooms + 1)}
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.selector}>
            <Text style={styles.label}>Guests</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setGuests(Math.max(1, guests - 1))}
              >
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{guests}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setGuests(guests + 1)}
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        
        <View style={styles.requestsContainer}>
          <Text style={styles.label}>Special Requests (Optional)</Text>
          <TextInput
            style={styles.requestsInput}
            multiline
            numberOfLines={3}
            placeholder="Any special requirements or requests..."
            value={specialRequests}
            onChangeText={setSpecialRequests}
          />
        </View>
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>
            ${hotel.price} × {nights} nights × {rooms} rooms
          </Text>
          <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Service fee</Text>
          <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmBooking}
      >
        <Text style={styles.confirmButtonText}>
          Confirm Booking - ${total.toFixed(2)}
        </Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  hotelSummary: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  hotelImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  hotelPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  selectorContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  selector: {
    flex: 1,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  counterButton: {
    padding: 12,
    minWidth: 44,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  requestsContainer: {
    marginBottom: 8,
  },
  requestsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
    backgroundColor: '#f8f9fa',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Booking;