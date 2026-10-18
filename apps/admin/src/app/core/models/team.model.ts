export type TeamCategory = 'psychiatrist' | 'psychologist';

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  category: TeamCategory;
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
