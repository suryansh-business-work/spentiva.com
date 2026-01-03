import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NotFound'>;

export default function NotFoundScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="alert-circle-outline" size={100} color="#9E9E9E" />
        <Text variant="displaySmall" style={styles.title}>
          404
        </Text>
        <Text variant="headlineSmall" style={styles.subtitle}>
          Page Not Found
        </Text>
        <Text variant="bodyLarge" style={styles.message}>
          The page you're looking for doesn't exist.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Trackers')}
          style={styles.button}
          icon="home"
        >
          Go to Home
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 24,
    color: '#9E9E9E',
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 24,
  },
});
