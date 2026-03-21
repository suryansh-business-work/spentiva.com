import React, { useCallback, useState, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import { FAB, Searchbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader, TrackerCard, EmptyState, ErrorView } from '@/components';
import { trackerService } from '@/services';
import type { Tracker } from '@/types';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const TrackersScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        onPress={() => {/* TODO: Open create tracker dialog */}}
      />
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
});
