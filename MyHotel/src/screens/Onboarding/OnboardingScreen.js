import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { completeOnboarding } = useAuth();

  const slides = [
    {
      id: 1,
      title: 'Discover Amazing Hotels',
      description: 'Find the perfect hotel for your next adventure with our curated selection',
      image: require('../../../assets/images/01-Onboarding Page/Onboarding 1.png'),
    },
    {
      id: 2,
      title: 'Easy Booking Process',
      description: 'Book your stay in just a few taps with our seamless booking system',
      image: require('../../../assets/images/01-Onboarding Page/Onboarding 2.png'),
    },
    {
      id: 3,
      title: 'Manage Your Trips',
      description: 'Keep track of all your bookings and travel plans in one place',
      image: require('../../../assets/images/01-Onboarding Page/Onboarding 3.png'),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      
      <Image source={slides[currentSlide].image} style={styles.image} />

      
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlide === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      
      <View style={styles.content}>
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
      </View>

      
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 20,
  },
  skipText: {
    color: '#007AFF',
    fontSize: 16,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    width: 24,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen;