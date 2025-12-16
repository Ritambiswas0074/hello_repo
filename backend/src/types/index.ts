import { Request } from 'express';
import { JWTPayload } from '../config/jwt';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

