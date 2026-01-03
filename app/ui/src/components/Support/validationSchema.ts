import * as Yup from 'yup';

export const supportFormSchema = Yup.object().shape({
  supportType: Yup.string()
    .required('Please select an issue type')
    .oneOf(['payment', 'bug', 'dataloss', 'other'], 'Invalid issue type'),

  subject: Yup.string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must not exceed 100 characters')
    .trim(),

  message: Yup.string()
    .required('Message is required')
    .min(20, 'Please provide at least 20 characters of detail')
    .max(2000, 'Message must not exceed 2000 characters')
    .trim(),
});

export interface SupportFormValues {
  supportType: string;
  subject: string;
  message: string;
}

export const initialFormValues: SupportFormValues = {
  supportType: '',
  subject: '',
  message: '',
};
