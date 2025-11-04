import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const initializeSampleHotels = async () => {
  const sampleHotels = [
    {
      id: 'hotel1',
      name: 'Luxury Beach Resort',
      location: 'Cape Town, South Africa',
      rating: 4.5,
      price: 250,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      description: 'Beautiful beachfront resort with amazing ocean views and premium amenities. Perfect for romantic getaways and family vacations.',
      amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Beach Access', 'Bar'],
      coordinates: {
        latitude: -33.9249,
        longitude: 18.4241
      }
    },
    {
      id: 'hotel2',
      name: 'Mountain View Hotel', 
      location: 'Johannesburg, South Africa',
      rating: 4.2,
      price: 180,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      description: 'Comfortable hotel with stunning mountain views and modern facilities. Great for business trips and weekend escapes.',
      amenities: ['Gym', 'Bar', 'Conference Room', 'Parking', 'WiFi', 'Pool'],
      coordinates: {
        latitude: -26.2041,
        longitude: 28.0473
      }
    },
    {
      id: 'hotel3',
      name: 'City Center Suites',
      location: 'Durban, South Africa',
      rating: 4.0,
      price: 120,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      description: 'Modern suites in the heart of the city with easy access to attractions, shopping, and dining.',
      amenities: ['WiFi', 'Restaurant', 'Business Center', 'Laundry', 'Concierge'],
      coordinates: {
        latitude: -29.8587,
        longitude: 31.0218
      }
    }
  ];

  try {
    for (const hotel of sampleHotels) {
      await setDoc(doc(db, 'hotels', hotel.id), hotel);
      console.log(`Added hotel: ${hotel.name}`);
    }
    console.log('Sample hotels initialized successfully');
  } catch (error) {
    console.error('Error initializing sample hotels:', error);
  }
};