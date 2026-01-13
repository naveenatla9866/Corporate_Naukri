export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  age?: number;
  resume?: File;
  termsAccepted: boolean;
}

export interface ApplicationStatus {
  id: string;
  userId: string;
  status: 'pending' | 'resume_received' | 'forwarded_to_hr' | 'interview_scheduled';
  createdAt: Date;
  updatedAt: Date;
  referralCode?: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  createdAt: Date;
}
