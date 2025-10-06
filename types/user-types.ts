import { UserWithRole } from './globals';

export interface UserContextType {
  user: UserWithRole | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  refreshUser?: () => Promise<void>;
}
