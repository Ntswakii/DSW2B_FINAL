// User operations
export const userService = {
  // Create or update user profile
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

  // Get user profile
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

  // Update user profile
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