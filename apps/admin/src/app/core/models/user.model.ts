export interface User {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'doctor';
  status: 'pending' | 'active' | 'inactive';
  twoFactorEnabled?: boolean;
  /** Feedback requests («Заявки») this user sees; admins see all */
  feedbackAccess?: FeedbackSpecialist[];
  createdAt: string;
}

export type FeedbackSpecialist = 'doctor' | 'psychologist';

/** Whether the user can open «Заявки»: admins always, others once an admin grants access. */
export const canSeeFeedback = (user: Pick<User, 'role' | 'feedbackAccess'> | null | undefined): boolean =>
  user?.role === 'admin' || !!user?.feedbackAccess?.length;

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
