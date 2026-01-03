import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Text,
  Button,
  List,
  Divider,
  Dialog,
  Portal,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import { trackerService } from '../../services/trackerService';
import { Tracker, Category } from '../../types';
import { Formik } from 'formik';
import { trackerValidationSchema } from '../../utils/validation';

interface Props {
  trackerId: string;
}

export default function TrackerSettingsTab({ trackerId }: Props) {
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  useEffect(() => {
    loadTrackerData();
  }, [trackerId]);

  const loadTrackerData = async () => {
    try {
      setLoading(true);
      const [trackerData, categoriesData] = await Promise.all([
        trackerService.getTracker(trackerId),
        trackerService.getCategories(trackerId),
      ]);
      setTracker(trackerData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading tracker data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracker = async (values: any) => {
    try {
      await trackerService.updateTracker(trackerId, values);
      setEditDialogVisible(false);
      await loadTrackerData();
    } catch (error) {
      console.error('Error updating tracker:', error);
    }
  };

  const handleDeleteTracker = async () => {
    try {
      await trackerService.deleteTracker(trackerId);
      // Navigate back to trackers list
      setDeleteDialogVisible(false);
    } catch (error) {
      console.error('Error deleting tracker:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!tracker) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="bodyLarge">Tracker not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tracker Details */}
      <Card style={styles.card}>
        <Card.Title title="Tracker Details" />
        <Card.Content>
          <List.Item
            title="Name"
            description={tracker.name}
            left={(props) => <List.Icon {...props} icon="label" />}
          />
          <Divider />
          <List.Item
            title="Description"
            description={tracker.description || 'No description'}
            left={(props) => <List.Icon {...props} icon="text" />}
          />
          <Divider />
          <List.Item
            title="Currency"
            description={tracker.currency}
            left={(props) => <List.Icon {...props} icon="currency-usd" />}
          />
          <Divider />
          <List.Item
            title="Budget"
            description={tracker.budget ? `${tracker.currency} ${tracker.budget}` : 'Not set'}
            left={(props) => <List.Icon {...props} icon="wallet" />}
          />
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => setEditDialogVisible(true)}>Edit Details</Button>
        </Card.Actions>
      </Card>

      {/* Categories */}
      <Card style={styles.card}>
        <Card.Title
          title="Categories"
          subtitle={`${categories.length} categories`}
          right={(props) => (
            <Button {...props} onPress={() => { }}>
              Manage
            </Button>
          )}
        />
        <Card.Content>
          {categories.slice(0, 5).map((category, index) => (
            <React.Fragment key={category.id}>
              <List.Item
                title={category.name}
                description={category.type}
                left={(props) => <List.Icon {...props} icon="tag" />}
              />
              {index < Math.min(4, categories.length - 1) && <Divider />}
            </React.Fragment>
          ))}
          {categories.length > 5 && (
            <Text variant="bodySmall" style={styles.moreText}>
              +{categories.length - 5} more categories
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Danger Zone */}
      <Card style={[styles.card, styles.dangerCard]}>
        <Card.Title title="Danger Zone" titleStyle={styles.dangerTitle} />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.dangerText}>
            Deleting this tracker will permanently remove all associated transactions, categories,
            and data. This action cannot be undone.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            textColor="white"
            buttonColor="#d32f2f"
            onPress={() => setDeleteDialogVisible(true)}
          >
            Delete Tracker
          </Button>
        </Card.Actions>
      </Card>

      {/* Edit Dialog */}
      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Tracker</Dialog.Title>
          <Dialog.Content>
            <Formik
              initialValues={{
                name: tracker.name,
                description: tracker.description || '',
                currency: tracker.currency,
                budget: tracker.budget?.toString() || '',
              }}
              validationSchema={trackerValidationSchema}
              onSubmit={handleUpdateTracker}
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
                  <TextInput
                    label="Description"
                    mode="outlined"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    multiline
                    numberOfLines={2}
                    style={styles.input}
                  />
                  <TextInput
                    label="Currency"
                    mode="outlined"
                    value={values.currency}
                    onChangeText={handleChange('currency')}
                    style={styles.input}
                  />
                  <TextInput
                    label="Budget"
                    mode="outlined"
                    value={values.budget}
                    onChangeText={handleChange('budget')}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <View style={styles.dialogActions}>
                    <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
                    <Button mode="contained" onPress={() => handleSubmit()}>
                      Save
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
          </Dialog.Content>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Tracker?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this tracker? This action cannot be undone and will
              permanently remove all data.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button textColor="#d32f2f" onPress={handleDeleteTracker}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  dangerCard: {
    borderColor: '#d32f2f',
    borderWidth: 1,
  },
  dangerTitle: {
    color: '#d32f2f',
  },
  dangerText: {
    color: '#666',
  },
  moreText: {
    marginTop: 8,
    opacity: 0.6,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
});
