import apiClient from '../api/axios';
import { 
  AccessSummaryResponseDto, 
  UserCreateRequestDto, 
  UserDetailResponseDto, 
  UserListResponseDto, 
  UserUpdateRequestDto 
} from '../types/admin';
import { PageResponse, UserRole } from '../types/common';

export const adminService = {
  getSummary: async () => {
    const response = await apiClient.get<AccessSummaryResponseDto>('/api/v1/admin/access/summary');
    return response.data;
  },

  getUsers: async (page: number, size: number, keyword?: string, role?: UserRole | '') => {
    const params: any = { page, size };
    if (keyword) params.keyword = keyword;
    if (role) params.role = role;
    
    const response = await apiClient.get<PageResponse<UserListResponseDto>>('/api/v1/admin/access/users', { params });
    return response.data;
  },

  getUserDetail: async (id: number) => {
    const response = await apiClient.get<UserDetailResponseDto>(`/api/v1/admin/access/users/${id}`);
    return response.data;
  },

  createUser: async (data: UserCreateRequestDto) => {
    const response = await apiClient.post('/api/v1/admin/access/users', data);
    return response.data;
  },

  updateUserRole: async (id: number, role: UserRole) => {
    const data: UserUpdateRequestDto = { role };
    const response = await apiClient.patch(`/api/v1/admin/access/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await apiClient.delete(`/api/v1/admin/access/users/${id}`);
    return response.data;
  }
};
