import axios from 'axios';

const postRequest = async (url: string, data: any = {}, authToken: string | null = null) => {
  const localToken = localStorage.getItem('authToken') || authToken;
  if (localToken) {
    const headers: any = {
      Authorization: `Bearer ${localToken}`,
      'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
    };
    return axios.post(url, data, {
      headers: headers,
    });
  } else {
    return axios.post(url, data);
  }
};

const patchRequest = async (url: string, data: any = {}, authToken: string | null = null) => {
  const localToken = localStorage.getItem('authToken') || authToken;
  if (localToken) {
    const headers: any = {
      Authorization: `Bearer ${localToken}`,
      'Content-Type': 'application/json',
    };
    return axios.patch(url, data, {
      headers: headers,
    });
  } else {
    return axios.patch(url, data);
  }
};

const putRequest = async (url: string, data: any = {}) => {
  const localToken = localStorage.getItem('authToken');
  if (localToken) {
    const headers: any = {
      Authorization: `Bearer ${localToken}`,
      'Content-Type': 'application/json',
    };
    return axios.put(url, data, {
      headers: headers,
    });
  } else {
    return axios.put(url, data);
  }
};

const getRequest = async (url: string, data: any = {}, authToken: string | null = null, extraHeaders: any = {}) => {
  const localToken = localStorage.getItem('authToken') || authToken;
  const headers: any = {
    ...extraHeaders,
    'Content-Type': 'application/json',
  };

  if (localToken) {
    headers.Authorization = `Bearer ${localToken}`;
  }

  return axios.get(url, { params: data, headers });
};

const deleteRequest = async (url: string, data: any = {}) => {
  const localToken = localStorage.getItem('authToken');
  if (localToken) {
    const headers: any = {
      Authorization: `Bearer ${localToken}`,
      'Content-Type': 'application/json',
    };
    return axios.delete(url, { data, headers });
  } else {
    return axios.delete(url, { data });
  }
};

export { postRequest, getRequest, patchRequest, putRequest, deleteRequest };
