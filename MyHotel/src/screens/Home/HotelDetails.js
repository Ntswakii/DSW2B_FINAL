import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput
} from 'react-native';

const defaultHotelImage = require('../../../assets/images/10-Hotel Detail Page/image-1.png');

function getHotelImageSource(hotel) {
  if (hotel && hotel.localImage) return hotel.localImage;
  return defaultHotelImage;
}
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/databaseService';
import RatingStars from '../../components/RatingStars';
import Loader from '../../components/Loader';
import { fetchWeatherForCity } from '../../services/api';

const HotelDetails = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    loadReviews();
    loadWeather();
  }, [hotel.id]);

  const loadReviews = async () => {
    try {
      const reviewsData = await reviewService.getHotelReviews(hotel.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const extractCity = (locationStr) => {
    if (!locationStr) return '';
    const parts = String(locationStr).split(',');
    return parts[0].trim();
  };

  const loadWeather = async () => {
    try {
      const city = extractCity(hotel.location);
      const w = await fetchWeatherForCity(city);
      setWeather(w);
    } catch (e) {
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to book a hotel',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('SignIn') }
        ]
      );
      return;
    }
    navigation.navigate('Booking', { hotel });
  };

  const handleAddReview = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add a review',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('SignIn') }
        ]
      );
      return;
    }
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!newReview.comment.trim()) {
      Alert.alert('Error', 'Please enter a review comment');
      return;
    }

    setLoading(true);
    try {
      await reviewService.addReview(hotel.id, newReview);
      await loadReviews();
      setShowReviewModal(false);
      setNewReview({ rating: 5, comment: '' });
      Alert.alert('Success', 'Thank you for your review!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
      console.error('Error submitting review:', error);
    }
    setLoading(false);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return hotel.rating || 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <Image source={getHotelImageSource(hotel)} style={styles.hotelImage} />

      
      <View style={styles.content}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.location}>📍 {hotel.location}</Text>
        <View style={styles.weatherRow}>
          {weatherLoading ? (
            <Text style={styles.weatherText}>Loading weather...</Text>
          ) : weather ? (
            <Text style={styles.weatherText}>
              {weather.city}: {weather.tempC}°C, {weather.description}
            </Text>
          ) : (
            <Text style={styles.weatherText}>Weather unavailable</Text>
          )}
        </View>

        <View style={styles.ratingPriceContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {getAverageRating()}</Text>
            <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
          </View>
          <Text style={styles.price}>${hotel.price}/night</Text>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{hotel.description}</Text>
        </View>

        
        {hotel.amenities && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {hotel.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>

        
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Guest Reviews</Text>
            <TouchableOpacity onPress={handleAddReview}>
              <Text style={styles.addReviewButton}>Add Review</Text>
            </TouchableOpacity>
          </View>

          {reviewsLoading ? (
            <Loader size="small" text="Loading reviews..." />
          ) : reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{review.userName}</Text>
                  <RatingStars rating={review.rating} size={16} />
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt?.toDate()).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Your Review</Text>

            <Text style={styles.ratingLabel}>Rating</Text>
            <RatingStars
              rating={newReview.rating}
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              editable={true}
              size={24}
            />

            <Text style={styles.commentLabel}>Your Review</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              placeholder="Share your experience with this hotel..."
              value={newReview.comment}
              onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowReviewModal(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitReview}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Submitting...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  hotelImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  weatherRow: {
    marginTop: -8,
    marginBottom: 16,
  },
  weatherText: {
    fontSize: 14,
    color: '#007AFF',
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9529',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  amenityText: {
    fontSize: 14,
    color: '#007AFF',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addReviewButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  reviewItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HotelDetails;