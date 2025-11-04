import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/databaseService';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { validateName } from '../../utils/validators';
import Loader from '../../components/Loader';

const EditProfile = ({ route, navigation }) => {
  const { user } = useAuth();
  const { profile, onProfileUpdate } = route.params;
  
  const [name, setName] = useState(profile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!validateName(name)) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name.trim()
      });

      // Update user document in Firestore
      await userService.updateUserProfile(user.uid, {
        name: name.trim(),
        phone: phone.trim(),
        updatedAt: new Date().toISOString()
      });

      Alert.alert('Success', 'Profile updated successfully');
      onProfileUpdate?.();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader text="Updating profile..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          autoComplete="name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user?.email}
          editable={false}
        />
        <Text style={styles.helperText}>
          Email cannot be changed
        </Text>

        <Text style={styles.label}>Phone Number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
        />

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: -16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfile;