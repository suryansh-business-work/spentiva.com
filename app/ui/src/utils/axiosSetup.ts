import axios from 'axios';

let tokenExpiredCallback: (() => void) | null = null;

export const setTokenExpiredCallback = (callback: () => void) => {
  tokenExpiredCallback = callback;
};

// Setup axios response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is a 401 with TOKEN_EXPIRED error code
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.error === 'TOKEN_EXPIRED'
    ) {
      // Trigger the token expired modal
      if (tokenExpiredCallback) {
        tokenExpiredCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default axios;