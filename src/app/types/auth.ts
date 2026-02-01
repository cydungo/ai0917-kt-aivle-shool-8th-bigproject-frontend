import { UserRole } from './common';

export type AuthType = 'PENDING' | 'AUTH' | 'ANON';

export interface AuthMeResponse {
  type: AuthType;
  // Common fields
  userId?: number;
  naverId?: string;
  name?: string;
  email?: string;

  // AUTH specific
  role?: UserRole;
  siteEmail?: string;

  // PENDING specific
  gender?: string;
  birthday?: string;
  birthYear?: string;
  mobile?: string;
  createdAt?: string;
}

export interface SignupPendingResponse {
  name?: string;
  mobile?: string;
}

export interface EmailRequest {
  email: string;
}

export interface EmailVerifyRequest {
  email: string;
  code: string;
}

export interface EmailVerifyResponse {
  ok: boolean;
}

export interface SignupCompleteRequest {
  siteEmail: string;
  sitePwd: string;
}

export interface SignupCompleteResponse {
  ok: boolean;
}

export interface LoginRequest {
  siteEmail?: string;
  sitePwd?: string;
  // For other login methods if needed
}

export interface LoginResponse {
  role?: UserRole;
  accessToken?: string; // Although we don't use it for storage, the API might return it
}

export interface PasswordResetCodeRequest {
  siteEmail: string;
  name: string;
}

export interface PasswordResetVerifyRequest {
  email: string;
  code: string;
}

export interface PasswordResetRequest {
  siteEmail: string;
  newPassword: string;
  newPasswordConfirm: string;
}
