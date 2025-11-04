import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const defaultHotelThumb = require('../../../assets/images/06-Explore Page/image-1.png');

function getHotelThumbSource(booking) {
  if (booking && booking.hotel && booking.hotel.localImage) return booking.hotel.localImage;
  return defaultHotelThumb;
}
import { bookingService } from '../../services/databaseService';
import { userService } from '../../services/databaseService';
import Loader from '../../components/Loader';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [bookingsData, profileData] = await Promise.all([
        bookingService.getUserBookings(user.uid),
        userService.getUserProfile(user.uid)
      ]);
      
      setBookings(bookingsData);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { 
      profile: userProfile,
      onProfileUpdate: loadUserData 
    });
  };

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>
          {user?.displayName || 'User'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {bookings.filter(b => b.status === 'confirmed').length}
          </Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {new Date().getFullYear() - new Date(user?.metadata?.creationTime).getFullYear()}
          </Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
      </View>

      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {bookings.length === 0 ? (
          <View style={styles.emptyBookings}>
            <Text style={styles.emptyBookingsText}>No bookings yet</Text>
            <Text style={styles.emptyBookingsSubtext}>
              Start exploring hotels and make your first booking!
            </Text>
          </View>
        ) : (
          bookings.slice(0, 3).map((booking) => (
            <TouchableOpacity key={booking.id} style={styles.bookingItem}>
              <Image 
                source={getHotelThumbSource(booking)} 
                style={styles.bookingImage}
              />
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingHotelName}>{booking.hotel.name}</Text>
                <Text style={styles.bookingDates}>
                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                </Text>
                <Text style={styles.bookingPrice}>${booking.total.toFixed(2)}</Text>
                <View style={[
                  styles.statusBadge,
                  booking.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge
                ]}>
                  <Text style={styles.statusText}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Payment Methods</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Help & Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyBookings: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyBookingsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptyBookingsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  bookingItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  bookingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  bookingHotelName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  bookingDates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confirmedBadge: {
    backgroundColor: '#d4edda',
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;