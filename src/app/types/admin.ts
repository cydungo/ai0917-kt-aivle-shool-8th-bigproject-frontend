import { UserRole } from './common';

export interface UserListResponseDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface UserCreateRequestDto {
  name: string;
  email: string;
  siteEmail?: string;
  sitePwd?: string;
  role: UserRole;
  mobile?: string;
}

export interface UserUpdateRequestDto {
  role: UserRole;
}

export interface AccessSummaryResponseDto {
  adminCount: number;
  managerCount: number;
  authorCount: number;
}

export interface UserDetailResponseDto {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  birthYear: string;
  gender: string;
}
