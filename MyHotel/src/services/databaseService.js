import { auth, db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';

// Hotel operations
export const hotelService = {
  getAllHotels: async () => {
    try {
      const hotelsCol = collection(db, 'hotels');
      const snap = await getDocs(hotelsCol);
      const hotels = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return hotels;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  }
};

// Review operations (stored as subcollection under each hotel)
export const reviewService = {
  getHotelReviews: async (hotelId) => {
    try {
      const reviewsCol = collection(db, 'hotels', hotelId, 'reviews');
      const q = query(reviewsCol, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  addReview: async (hotelId, review) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const reviewsCol = collection(db, 'hotels', hotelId, 'reviews');
      const payload = {
        userId: user.uid,
        userName: user.displayName || user.email,
        rating: review.rating,
        comment: review.comment,
        createdAt: serverTimestamp()
      };

      await addDoc(reviewsCol, payload);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
};

// Booking operations (stored under users/{uid}/bookings)
export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const bookingsCol = collection(db, 'users', user.uid, 'bookings');
      const payload = {
        ...bookingData,
        status: 'confirmed',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(bookingsCol, payload);
      return { id: docRef.id, ...payload };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  getUserBookings: async (userId) => {
    try {
      if (!userId) return [];
      const bookingsCol = collection(db, 'users', userId, 'bookings');
      const q = query(bookingsCol, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }
};

// User profile operations
export const userService = {
  createUserProfile: async (userData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const profile = {
        uid: user.uid,
        email: user.email,
        name: userData.name || user.displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  getUserProfile: async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  updateUserProfile: async (userId, updates) => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};
