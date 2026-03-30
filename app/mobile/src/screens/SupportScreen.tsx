import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import { Text, FAB, Chip, useTheme, Portal, Dialog, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader, Breadcrumb, EmptyState, ErrorView, AppButton } from '@/components';
import { supportService } from '@/services';
import { useSnackbar } from '@/contexts';
import type { SupportTicket, TicketStatus } from '@/types';

const STATUS_COLORS: Record<TicketStatus, string> = {
  Open: '#3B82F6',
  InProgress: '#F59E0B',
  Closed: '#10B981',
  Escalated: '#EF4444',
};

export const SupportScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { showSnackbar } = useSnackbar();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await supportService.getAll();
    if (res.success && res.data) {
      setTickets(res.data);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const renderItem = useCallback(
    ({ item }: { item: SupportTicket }) => (
      <View style={[styles.ticketCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.ticketHeader}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            #{item.ticketId}
          </Text>
          <Chip compact textStyle={styles.chipText} style={{ backgroundColor: STATUS_COLORS[item.status] + '20' }}>
            {item.status}
          </Chip>
        </View>
        <Text variant="titleSmall" style={styles.ticketSubject}>{item.subject}</Text>
        <Text variant="bodySmall" numberOfLines={2} style={{ color: theme.colors.onSurfaceVariant }}>
          {item.description}
        </Text>
        <Text variant="labelSmall" style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    ),
    [theme]
  );

  const keyExtractor = useCallback((item: SupportTicket) => item._id, []);

  if (error) {
    return <ErrorView message={error} onRetry={fetchTickets} />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Support" onBack={() => navigation.goBack()} />
      <Breadcrumb items={[{ label: 'More', onPress: () => navigation.goBack() }, { label: 'Support' }]} />
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={tickets.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTickets} colors={[theme.colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="lifebuoy" title="No Tickets" description="You haven't created any support tickets yet." />
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
          <Dialog.Title>Create Ticket</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <TextInput
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              mode="outlined"
              autoFocus
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <AppButton title="Cancel" mode="text" onPress={() => setDialogVisible(false)} />
            <AppButton
              title="Submit"
              mode="contained"
              onPress={async () => {
                if (!subject.trim() || !description.trim()) return;
                setCreating(true);
                const res = await supportService.create({
                  type: 'general',
                  subject: subject.trim(),
                  description: description.trim(),
                });
                if (res.success) {
                  showSnackbar('Ticket created', 'success');
                  setDialogVisible(false);
                  setSubject('');
                  setDescription('');
                  fetchTickets();
                } else {
                  showSnackbar(res.message || 'Failed to create ticket', 'error');
                }
                setCreating(false);
              }}
              loading={creating}
              disabled={creating || !subject.trim() || !description.trim()}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: 16, gap: 12, paddingBottom: 80 },
  emptyList: { flex: 1 },
  ticketCard: { padding: 16, borderRadius: 12, elevation: 1, gap: 8 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketSubject: { fontFamily: 'Inter-SemiBold' },
  chipText: { fontSize: 11 },
  date: { marginTop: 4 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
  dialogContent: { gap: 12 },
});
