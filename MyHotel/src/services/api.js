
export const fetchRecommendedHotels = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products?limit=6');
    const products = await response.json();

    return products.map((product, index) => ({
      id: product.id.toString(),
      name: product.title.length > 30 ? product.title.substring(0, 30) + '...' : product.title,
      location: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'][index % 6],
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3-5 stars
      price: Math.round(product.price * 15), // Convert to realistic hotel prices
      image: product.image,
      description: product.description.length > 150 ? product.description.substring(0, 150) + '...' : product.description,
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Parking'].slice(0, Math.floor(Math.random() * 4) + 2)
    }));
  } catch (error) {
    console.error('Error fetching hotels:', error);
  
    return getFallbackHotels();
  }
};

export const fetchWeatherForCity = async (city) => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || 'YOUR_OPENWEATHER_API_KEY';
    if (!apiKey || apiKey === 'YOUR_OPENWEATHER_API_KEY') {
      return null;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      tempC: Math.round(data.main?.temp ?? 0),
      description: data.weather?.[0]?.description || 'N/A',
      feelsLikeC: Math.round(data.main?.feels_like ?? 0),
      humidity: data.main?.humidity ?? null,
      windKmh: data.wind?.speed != null ? Math.round(data.wind.speed * 3.6) : null,
      condition: data.weather?.[0]?.main || 'N/A',
      city: data.name || city,
    };
  } catch (e) {
    return null;
  }
};


const getFallbackHotels = () => [
  {
    id: '1',
    name: 'Luxury Beach Resort',
    location: 'Cape Town',
    rating: 4.5,
    price: 250,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    description: 'Beautiful beachfront resort with amazing ocean views and premium amenities.',
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi']
  },
  {
    id: '2',
    name: 'Mountain View Hotel',
    location: 'Johannesburg',
    rating: 4.2,
    price: 180,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
    description: 'Comfortable hotel with stunning mountain views and modern facilities.',
    amenities: ['Gym', 'Bar', 'Conference Room', 'Parking']
  },
  {
    id: '3',
    name: 'City Center Suites',
    location: 'Durban',
    rating: 4.0,
    price: 120,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    description: 'Modern suites in the heart of the city with easy access to attractions.',
    amenities: ['WiFi', 'Restaurant', 'Business Center', 'Laundry']
  }
];

