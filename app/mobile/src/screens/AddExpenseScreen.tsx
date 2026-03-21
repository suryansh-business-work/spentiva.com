import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ScreenHeader, Breadcrumb, FormInput, AppButton } from '@/components';
import { expenseService } from '@/services';
import { useSnackbar } from '@/contexts';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'AddExpense'>;

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
  type: 'expense' | 'income';
}

export const AddExpenseScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { trackerId } = route.params;
  const { showSnackbar } = useSnackbar();

  const handleSubmit = useCallback(
    async (values: ExpenseFormValues) => {
      try {
        const res = await expenseService.create({
          trackerId,
          type: values.type,
          amount: parseFloat(values.amount),
          category: values.category,
          description: values.description,
          paymentMethod: values.paymentMethod,
          currency: 'USD',
        });
        if (res.success) {
          showSnackbar('Expense added successfully', 'success');
          navigation.goBack();
        } else {
          showSnackbar(res.message || 'Failed to add expense', 'error');
        }
      } catch {
        showSnackbar('Failed to add expense', 'error');
      }
    },
    [trackerId, showSnackbar, navigation]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Add Expense" onBack={() => navigation.goBack()} />
      <Breadcrumb
        items={[
          { label: 'Trackers', onPress: () => navigation.navigate('Main') },
          { label: 'Add Expense' },
        ]}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{
            amount: '',
            category: '',
            description: '',
            paymentMethod: '',
            type: 'expense' as const,
          }}
          validationSchema={expenseSchema}
          onSubmit={handleSubmit}
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
                title="Add Expense"
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
