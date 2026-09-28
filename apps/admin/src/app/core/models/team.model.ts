export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  specializations: string[];
  photo: string;
  email: string;
  phone: string;
  experience: string;
  education: string[];
  isActive: boolean;
  order: number;
  userId?: string;
  createdAt: string;
}

export type TeamMemberDto = Omit<TeamMember, '_id' | 'createdAt'>;
