import React, { useCallback, useState, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import { FAB, Searchbar, useTheme, Portal, Dialog, TextInput, RadioButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader, TrackerCard, EmptyState, ErrorView, AppButton } from '@/components';
import { trackerService } from '@/services';
import { useSnackbar } from '@/contexts';
import type { Tracker } from '@/types';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const TrackersScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { showSnackbar } = useSnackbar();
  const [search, setSearch] = useState('');
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'personal' | 'business'>('personal');
  const [creating, setCreating] = useState(false);

  const fetchTrackers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await trackerService.getAll();
    if (res.success && res.data) {
      setTrackers(res.data);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrackers();
  }, [fetchTrackers]);

  const filtered = trackers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePress = useCallback(
    (tracker: Tracker) => {
      navigation.navigate('TrackerDetail', { trackerId: tracker._id });
    },
    [navigation]
  );

  const handleCreate = useCallback(async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const res = await trackerService.create({
      name: newName.trim(),
      type: newType,
      currency: 'USD',
    });
    if (res.success) {
      showSnackbar('Tracker created', 'success');
      setDialogVisible(false);
      setNewName('');
      setNewType('personal');
      fetchTrackers();
    } else {
      showSnackbar(res.message || 'Failed to create tracker', 'error');
    }
    setCreating(false);
  }, [newName, newType, showSnackbar, fetchTrackers]);

  const renderItem = useCallback(
    ({ item }: { item: Tracker }) => (
      <TrackerCard tracker={item} onPress={handlePress} />
    ),
    [handlePress]
  );

  const keyExtractor = useCallback((item: Tracker) => item._id, []);

  if (error) {
    return <ErrorView message={error} onRetry={fetchTrackers} />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Trackers" />
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search trackers..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
      </View>
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTrackers} colors={[theme.colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="wallet-outline"
              title="No Trackers Yet"
              description="Create your first tracker to start managing expenses."
            />
          ) : null
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => setDialogVisible(true)}
      />
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Create Tracker</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <TextInput
              label="Tracker Name"
              value={newName}
              onChangeText={setNewName}
              mode="outlined"
              autoFocus
            />
            <Text variant="labelLarge" style={styles.typeLabel}>Type</Text>
            <RadioButton.Group onValueChange={(v) => setNewType(v as 'personal' | 'business')} value={newType}>
              <RadioButton.Item label="Personal" value="personal" />
              <RadioButton.Item label="Business" value="business" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <AppButton title="Cancel" mode="text" onPress={() => setDialogVisible(false)} />
            <AppButton
              title="Create"
              mode="contained"
              onPress={handleCreate}
              loading={creating}
              disabled={creating || !newName.trim()}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  searchContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  searchbar: { borderRadius: 12 },
  list: { paddingBottom: 80 },
  emptyList: { flex: 1 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
  dialogContent: { gap: 12 },
  typeLabel: { marginTop: 8 },
});
