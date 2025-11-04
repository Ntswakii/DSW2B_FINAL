import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { fetchRecommendedHotels } from '../../services/api';
import HotelCard from '../../components/HotelCard';
import Loader from '../../components/Loader';

const Deals = ({ navigation }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const dealsData = await fetchRecommendedHotels();
      // Add discount to create deals
      const dealsWithDiscount = dealsData.map(hotel => ({
        ...hotel,
        originalPrice: hotel.price,
        price: Math.round(hotel.price * 0.8), // 20% discount
        discount: '20% OFF',
      }));
      setDeals(dealsWithDiscount);
    } catch (error) {
      Alert.alert('Error', 'Failed to load special deals');
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelPress = (hotel) => {
    navigation.navigate('HotelDetails', { hotel });
  };

  const renderDealItem = ({ item }) => (
    <View style={styles.dealCard}>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <HotelCard hotel={item} onPress={() => handleHotelPress(item)} />
      <View style={styles.priceComparison}>
        <Text style={styles.originalPrice}>${item.originalPrice}</Text>
        <Text style={styles.finalPrice}>${item.price}/night</Text>
      </View>
    </View>
  );

  if (loading) {
    return <Loader text="Loading special deals..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Special Deals</Text>
        <Text style={styles.subtitle}>
          Limited time offers on amazing hotels
        </Text>
      </View>

      <FlatList
        data={deals}
        renderItem={renderDealItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No deals available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for special offers
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  dealCard: {
    position: 'relative',
    marginBottom: 20,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Deals;