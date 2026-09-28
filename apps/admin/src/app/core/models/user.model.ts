export interface User {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'doctor';
  status: 'pending' | 'active' | 'inactive';
  twoFactorEnabled?: boolean;
  createdAt: string;
}

export interface SessionInfo {
  _id: string;
  userAgent: string;
  ip: string;
  lastSeen: string;
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'doctor';
}
