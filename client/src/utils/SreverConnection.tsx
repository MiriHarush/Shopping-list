import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  success: boolean;
  result?: T;
  error?: any;
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

const handleServerError = (error: any): ApiResponse => {
  console.error('Server error:', error);
  return { success: false, error };
};

export const axiosRequest = async <T = any>(
  method: HttpMethod,
  myUrl: string,
  data?: any
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('RestToken');
  const authorization = `Bearer ${token}`;
  const baseUrl = 'http://localhost:3000';

  const config: AxiosRequestConfig = {
    headers: {
      'Authorization': authorization,
    },
    method,
    url: baseUrl + myUrl,
    data,
  };

  console.log('config', config);

  try {
    const response: AxiosResponse<T> = await axios(config);
    console.log('Data from server:', response.data);
    return { success: true, result: response.data };
  } catch (error) {
    return handleServerError(error);
  }
};
