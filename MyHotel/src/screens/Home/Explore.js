import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { hotelService } from '../../services/databaseService';
import HotelCard from '../../components/HotelCard';
import Loader from '../../components/Loader';

const Explore = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [hotels, searchQuery, sortBy, priceRange]);

  const loadHotels = async () => {
    try {
      const hotelsData = await hotelService.getAllHotels();
      setHotels(hotelsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load hotels');
      console.error('Error loading hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHotels = () => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

    
    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredHotels(filtered);
  };

  const handleHotelPress = (hotel) => {
    navigation.navigate('HotelDetails', { hotel });
  };

  if (loading) {
    return <Loader text="Loading hotels..." />;
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Sort by:</Text>
        <View style={styles.filterButtons}>
          {['rating', 'price', 'name'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterButton,
                sortBy === option && styles.activeFilterButton
              ]}
              onPress={() => setSortBy(option)}
            >
              <Text style={[
                styles.filterButtonText,
                sortBy === option && styles.activeFilterButtonText
              ]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      
      <Text style={styles.resultsCount}>
        {filteredHotels.length} hotels found
      </Text>

      
      <FlatList
        data={filteredHotels}
        renderItem={({ item }) => (
          <HotelCard 
            hotel={item}
            onPress={() => handleHotelPress(item)}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hotels found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
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
  searchContainer: {
    marginVertical: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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

export default Explore;