import { useState, useCallback, useMemo } from 'react';
import { endpoints, getApiUrl } from '../../../config/api';
import { putRequest, postRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';

interface ProfileUpdateState {
  loading: boolean;
  error: string;
  message: string;
}

export const useProfileUpdate = (
  user: any,
  updateUser: (user: any) => void,
  _token: string | null
) => {
  const [state, setState] = useState<ProfileUpdateState>({
    loading: false,
    error: '',
    message: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  /**
   * Get profile photo URL
   */
  const getPhotoUrl = useCallback((): string | undefined => {
    if (photoPreview) return photoPreview;
    if (user?.profilePhoto) {
      if (user.profilePhoto.startsWith('http')) {
        return user.profilePhoto;
      }
      return `${getApiUrl()}/${user.profilePhoto}`;
    }
    return undefined;
  }, [photoPreview, user?.profilePhoto]);

  /**
   * Update user profile (name)
   */
  const updateProfile = useCallback(
    async (name: string) => {
      setState({ loading: true, error: '', message: '' });

      try {
        const response = await putRequest(endpoints.auth.profile, { name });
        const data = parseResponseData<any>(response, null);
        const updatedUser = data?.user;

        if (updatedUser) {
          updateUser(updatedUser);
          setState({ loading: false, error: '', message: 'Profile updated successfully' });
          return true;
        } else {
          setState({ loading: false, error: '', message: 'Profile updated successfully' });
          return true;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to update profile';
        setState({ loading: false, error: errorMessage, message: '' });
        return false;
      }
    },
    [updateUser]
  );

  /**
   * Upload profile photo
   */
  const uploadPhoto = useCallback(
    async (file: File) => {
      setState({ loading: true, error: '', message: '' });

      const formData = new FormData();
      formData.append('photo', file);

      try {
        const response = await postRequest(endpoints.auth.profilePhoto, formData);
        const data = parseResponseData<any>(response, null);
        const updatedUser = data?.user;

        if (updatedUser) {
          updateUser(updatedUser);
          setState({ loading: false, error: '', message: 'Profile photo updated successfully' });
        }

        // Update preview
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);

        return true;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to upload photo';
        setState({ loading: false, error: errorMessage, message: '' });
        return false;
      }
    },
    [updateUser]
  );

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: '', message: '' }));
  }, []);

  return useMemo(
    () => ({
      ...state,
      photoPreview,
      getPhotoUrl,
      updateProfile,
      uploadPhoto,
      clearMessages,
    }),
    [state, photoPreview, getPhotoUrl, updateProfile, uploadPhoto, clearMessages]
  );
};
