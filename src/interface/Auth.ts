export enum Role {
  ADMIN = "admins",
  USER = "user",
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  token: number;
  photoURL?: string;
  updatedAt: Date;
  createdAt: Date;
  emailVerified?: boolean;
  isActive: boolean;
}

export interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserAccount>;
  loginWithGoogle: () => Promise<UserAccount>;
  loginWithGithub: () => Promise<UserAccount>;
  loginWithFacebook: () => Promise<UserAccount>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  getDashboardUrl: (userRole: string) => string;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  resetPasswordWithOTP: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
  resendResetOTP: (email: string) => Promise<void>;
  showInactiveModal: boolean;
  setShowInactiveModal: (show: boolean) => void;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
