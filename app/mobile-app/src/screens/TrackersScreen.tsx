import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  FAB,
  Searchbar,
  Chip,
  ActivityIndicator,
  Portal,
  Dialog,
  Button,
  TextInput,
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trackerService } from '../services/trackerService';
import { Tracker } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Formik } from 'formik';
import { trackerValidationSchema } from '../utils/validation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Trackers'>;

export default function TrackersScreen({ navigation }: Props) {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [filteredTrackers, setFilteredTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<Tracker | null>(null);

  useEffect(() => {
    loadTrackers();
  }, []);

  useEffect(() => {
    filterTrackers();
  }, [searchQuery, trackers]);

  const loadTrackers = async () => {
    try {
      setLoading(true);
      const data = await trackerService.getTrackers();
      setTrackers(data);
      setFilteredTrackers(data);
    } catch (error: any) {
      console.error('Error loading trackers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrackers();
    setRefreshing(false);
  }, []);

  const filterTrackers = () => {
    if (searchQuery === '') {
      setFilteredTrackers(trackers);
    } else {
      const filtered = trackers.filter((tracker) =>
        tracker.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTrackers(filtered);
    }
  };

  const handleCreateTracker = async (values: any) => {
    try {
      await trackerService.createTracker(values);
      setDialogVisible(false);
      await loadTrackers();
    } catch (error: any) {
      console.error('Error creating tracker:', error);
    }
  };

  const handleUpdateTracker = async (values: any) => {
    if (!selectedTracker) return;
    try {
      await trackerService.updateTracker(selectedTracker.id, values);
      setDialogVisible(false);
      setSelectedTracker(null);
      await loadTrackers();
    } catch (error: any) {
      console.error('Error updating tracker:', error);
    }
  };

  const openCreateDialog = () => {
    setSelectedTracker(null);
    setDialogVisible(true);
  };

  const openEditDialog = (tracker: Tracker) => {
    setSelectedTracker(tracker);
    setDialogVisible(true);
  };

  const renderTracker = ({ item }: { item: Tracker }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TrackerView', { trackerId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge" style={styles.trackerName}>
              {item.name}
            </Text>
            <Button mode="text" onPress={() => openEditDialog(item)}>
              Edit
            </Button>
          </View>
          {item.description && (
            <Text variant="bodyMedium" style={styles.description}>
              {item.description}
            </Text>
          )}
          <View style={styles.metaContainer}>
            <Chip icon="currency-usd" style={styles.chip}>
              {item.currency}
            </Chip>
            {item.budget && (
              <Chip icon="wallet" style={styles.chip}>
                Budget: {formatCurrency(item.budget, item.currency)}
              </Chip>
            )}
          </View>
          <Text variant="bodySmall" style={styles.date}>
            Created {formatDate(item.createdAt)}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          My Trackers
        </Text>
        <Searchbar
          placeholder="Search trackers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredTrackers}
        renderItem={renderTracker}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No trackers found</Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Create your first expense tracker to get started
            </Text>
          </View>
        }
      />

      <FAB style={styles.fab} icon="plus" onPress={openCreateDialog} label="New Tracker" />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{selectedTracker ? 'Edit Tracker' : 'Create Tracker'}</Dialog.Title>
          <Dialog.Content>
            <Formik
              initialValues={{
                name: selectedTracker?.name || '',
                description: selectedTracker?.description || '',
                currency: selectedTracker?.currency || 'USD',
                budget: selectedTracker?.budget?.toString() || '',
              }}
              validationSchema={trackerValidationSchema}
              onSubmit={selectedTracker ? handleUpdateTracker : handleCreateTracker}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <TextInput
                    label="Name"
                    mode="outlined"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={touched.name && !!errors.name}
                    style={styles.input}
                  />
                  <HelperText type="error" visible={touched.name && !!errors.name}>
                    {errors.name}
                  </HelperText>

                  <TextInput
                    label="Description (optional)"
                    mode="outlined"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    multiline
                    numberOfLines={2}
                    style={styles.input}
                  />

                  <TextInput
                    label="Currency"
                    mode="outlined"
                    value={values.currency}
                    onChangeText={handleChange('currency')}
                    onBlur={handleBlur('currency')}
                    error={touched.currency && !!errors.currency}
                    style={styles.input}
                  />
                  <HelperText type="error" visible={touched.currency && !!errors.currency}>
                    {errors.currency}
                  </HelperText>

                  <TextInput
                    label="Budget (optional)"
                    mode="outlined"
                    value={values.budget}
                    onChangeText={handleChange('budget')}
                    onBlur={handleBlur('budget')}
                    keyboardType="numeric"
                    style={styles.input}
                  />

                  <View style={styles.dialogActions}>
                    <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                    <Button mode="contained" onPress={() => handleSubmit()}>
                      {selectedTracker ? 'Update' : 'Create'}
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchbar: {
    elevation: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackerName: {
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    marginBottom: 12,
    opacity: 0.7,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  date: {
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptySubtext: {
    marginTop: 8,
    opacity: 0.6,
  },
  input: {
    marginBottom: 4,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
});
