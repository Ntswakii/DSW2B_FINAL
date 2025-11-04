import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    // Ensure boolean values are stored as booleans
    if (typeof value === 'boolean') {
      await AsyncStorage.setItem(key, JSON.stringify(Boolean(value)));
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    const parsed = JSON.parse(value);
    // Ensure boolean values remain boolean
    return typeof parsed === 'boolean' ? Boolean(parsed) : parsed;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};