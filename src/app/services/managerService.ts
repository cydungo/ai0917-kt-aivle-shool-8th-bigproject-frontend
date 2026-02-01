import apiClient from '../api/axios';
import { PageResponse } from '../types/common';
import {
  IPTrendDashboardDto,
  IPTrendReportDto,
  IPTrendPreviewDto,
  AuthorSummaryDto,
  ManagerAuthorDto,
  ManagerAuthorDetailDto,
} from '../types/manager';

export const managerService = {
  // IP Trend Analysis
  getIPTrend: async () => {
    const response = await apiClient.get<IPTrendDashboardDto>(
      '/api/v1/manager/iptrend',
    );
    return response.data;
  },

  getIPTrendList: async (page = 0, size = 10) => {
    const response = await apiClient.get<PageResponse<IPTrendReportDto>>(
      '/api/v1/manager/iptrend/list',
      { params: { page, size } },
    );
    return response.data;
  },

  getIPTrendPreview: async (id: number) => {
    const response = await apiClient.get<IPTrendPreviewDto>(
      `/api/v1/manager/iptrend/preview/${id}`,
    );
    return response.data;
  },

  getIPTrendReport: async () => {
    const response = await apiClient.get('/api/v1/manager/iptrend/report', {
      responseType: 'blob',
    });
    return response.data;
  },

  generateIPTrend: async (data: {
    analysisDate?: string;
    dataSource?: string;
    forceRegenerate?: boolean;
  }) => {
    const response = await apiClient.post(
      '/api/v1/manager/iptrend/generate',
      data,
    );
    return response.data;
  },

  downloadIPTrendReport: async (id: number) => {
    const response = await apiClient.get(
      `/api/v1/manager/iptrend/download/${id}`,
      { responseType: 'blob' },
    );
    return response.data;
  },

  // Author Management
  getAuthors: async (params: {
    keyword?: string;
    sort?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await apiClient.get<PageResponse<ManagerAuthorDto>>(
      '/api/v1/manager/authors',
      { params },
    );
    return response.data;
  },

  getAuthorsSummary: async () => {
    const response = await apiClient.get<AuthorSummaryDto>(
      '/api/v1/manager/authors/summary',
    );
    return response.data;
  },

  getAuthorDetail: async (id: number) => {
    const response = await apiClient.get<ManagerAuthorDetailDto>(
      `/api/v1/manager/authors/${id}`,
    );
    return response.data;
  },

  matchAuthor: async (pwd: string) => {
    const response = await apiClient.post(`/api/v1/manager/authors/${pwd}`);
    return response.data;
  },
};
