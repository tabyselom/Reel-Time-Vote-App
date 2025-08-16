export interface user {
  id: number;
  fullname: string;
  email: string;
  password: string;
}
export interface loginUser {
  email: string;
  password: string;
}

export type UserStoreType = {
  user: user | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  //dsd
  CheckUser: () => void;
  Signup: (data: { fullname: string; email: string; password: string }) => void;

  Login: (data: { email: string; password: string }) => void;

  Logout: () => void;
};
