import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ProfileTab() {
  // Redirect to the full profile screen
  React.useEffect(() => {
    router.replace('/profile');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting to profile...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});