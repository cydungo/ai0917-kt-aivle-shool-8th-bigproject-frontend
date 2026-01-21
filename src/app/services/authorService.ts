import axios from 'axios';
import { ExtractSettingRequest, ExtractSettingResponse } from '../types/author';

// AI Service URL could be different from Main Backend
const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL;

export const authorService = {
  extractSettings: async (data: ExtractSettingRequest) => {
    if (!AI_BASE_URL) {
      throw new Error('AI_BASE_URL is not defined');
    }
    const response = await axios.post<ExtractSettingResponse>(
      `${AI_BASE_URL}/novel`,
      data,
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        // Explicitly set withCredentials to false as the original code didn't use it
        // and it might be a cross-origin request to a server not expecting cookies
        withCredentials: false,
      },
    );
    return response.data;
  },
};
