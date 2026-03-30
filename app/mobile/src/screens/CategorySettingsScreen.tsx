import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import { Text, IconButton, useTheme, FAB, Portal, Dialog, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ScreenHeader, Breadcrumb, EmptyState, ErrorView, AppButton } from '@/components';
import { categoryService } from '@/services';
import { useSnackbar } from '@/contexts';
import type { Category } from '@/types';
import type { RootStackParamList } from '@/types/navigation';

type Route = RouteProp<RootStackParamList, 'CategorySettings'>;

export const CategorySettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { trackerId } = route.params;
  const { showSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await categoryService.getAll(trackerId);
    if (res.success && res.data) {
      setCategories(res.data);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, [trackerId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await categoryService.delete(id);
      if (res.success) {
        showSnackbar('Category deleted', 'success');
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        showSnackbar(res.message || 'Failed to delete', 'error');
      }
    },
    [showSnackbar]
  );

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.cardContent}>
          <View style={[styles.colorDot, { backgroundColor: item.color || theme.colors.primary }]} />
          <View style={styles.cardText}>
            <Text variant="titleSmall" style={styles.catName}>{item.name}</Text>
            {item.subcategories.length > 0 && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.subcategories.join(', ')}
              </Text>
            )}
          </View>
        </View>
        <IconButton icon="delete-outline" size={20} onPress={() => handleDelete(item._id)} />
      </View>
    ),
    [theme, handleDelete]
  );

  const keyExtractor = useCallback((item: Category) => item._id, []);

  if (error) {
    return <ErrorView message={error} onRetry={fetchCategories} />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Categories" onBack={() => navigation.goBack()} />
      <Breadcrumb
        items={[
          { label: 'Trackers', onPress: () => navigation.goBack() },
          { label: 'Categories' },
        ]}
      />
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={categories.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchCategories} colors={[theme.colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="tag-outline" title="No Categories" description="Add categories to organize your expenses." />
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
          <Dialog.Title>Add Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={newCatName}
              onChangeText={setNewCatName}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <AppButton title="Cancel" mode="text" onPress={() => setDialogVisible(false)} />
            <AppButton
              title="Add"
              mode="contained"
              onPress={async () => {
                if (!newCatName.trim()) return;
                setCreating(true);
                const res = await categoryService.create({
                  name: newCatName.trim(),
                  trackerId,
                  subcategories: [],
                });
                if (res.success) {
                  showSnackbar('Category added', 'success');
                  setDialogVisible(false);
                  setNewCatName('');
                  fetchCategories();
                } else {
                  showSnackbar(res.message || 'Failed to add category', 'error');
                }
                setCreating(false);
              }}
              loading={creating}
              disabled={creating || !newCatName.trim()}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: 16, gap: 8, paddingBottom: 80 },
  emptyList: { flex: 1 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, elevation: 1 },
  cardContent: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  cardText: { flex: 1, gap: 2 },
  catName: { fontFamily: 'Inter-Medium' },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
});
