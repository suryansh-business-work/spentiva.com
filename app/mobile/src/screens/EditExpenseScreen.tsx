import React, { useCallback, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ScreenHeader, Breadcrumb, FormInput, AppButton, LoadingOverlay, ErrorView } from '@/components';
import { expenseService } from '@/services';
import { useSnackbar } from '@/contexts';
import type { Expense } from '@/types';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'EditExpense'>;

const expenseSchema = Yup.object().shape({
  amount: Yup.number().positive('Must be positive').required('Amount is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
});

interface ExpenseFormValues {
  amount: string;
  category: string;
  description: string;
  paymentMethod: string;
}

export const EditExpenseScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { expenseId } = route.params;
  const { showSnackbar } = useSnackbar();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpense = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await expenseService.getById(expenseId);
    if (res.success && res.data) {
      setExpense(res.data);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, [expenseId]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  const handleSubmit = useCallback(
    async (values: ExpenseFormValues) => {
      try {
        const res = await expenseService.update(expenseId, {
          amount: parseFloat(values.amount),
          category: values.category,
          description: values.description,
          paymentMethod: values.paymentMethod,
        });
        if (res.success) {
          showSnackbar('Expense updated successfully', 'success');
          navigation.goBack();
        } else {
          showSnackbar(res.message || 'Failed to update expense', 'error');
        }
      } catch {
        showSnackbar('Failed to update expense', 'error');
      }
    },
    [expenseId, showSnackbar, navigation]
  );

  if (loading) return <LoadingOverlay visible message="Loading expense..." />;
  if (error) return <ErrorView message={error} onRetry={fetchExpense} />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Edit Expense" onBack={() => navigation.goBack()} />
      <Breadcrumb
        items={[
          { label: 'Trackers', onPress: () => navigation.navigate('Main') },
          { label: 'Edit Expense' },
        ]}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{
            amount: expense?.amount?.toString() ?? '',
            category: expense?.category ?? '',
            description: expense?.description ?? '',
            paymentMethod: expense?.paymentMethod ?? '',
          }}
          validationSchema={expenseSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit: submit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <FormInput
                label="Amount"
                value={values.amount}
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                error={errors.amount}
                touched={touched.amount}
                keyboardType="numeric"
              />
              <FormInput
                label="Category"
                value={values.category}
                onChangeText={handleChange('category')}
                onBlur={handleBlur('category')}
                error={errors.category}
                touched={touched.category}
              />
              <FormInput
                label="Description"
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                error={errors.description}
                touched={touched.description}
                multiline
              />
              <FormInput
                label="Payment Method"
                value={values.paymentMethod}
                onChangeText={handleChange('paymentMethod')}
                onBlur={handleBlur('paymentMethod')}
                error={errors.paymentMethod}
                touched={touched.paymentMethod}
              />
              <AppButton
                title="Update Expense"
                mode="contained"
                onPress={() => submit()}
                loading={isSubmitting}
                disabled={isSubmitting}
                fullWidth
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  form: { gap: 12 },
});
