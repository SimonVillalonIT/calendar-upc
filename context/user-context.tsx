'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole, logOut } from '@/lib/utils';
import { UserWithRole } from '@/types/globals';
import { UserContextType } from '@/types/user-types';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  initialUserData,
}: {
  children: ReactNode;
  initialUserData: UserWithRole | null;
}) => {
  const [userData, setUserData] = useState<UserWithRole | null>(
    initialUserData
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only fetch if we don't have initial data to avoid flash of loading
    if (!initialUserData) {
      setIsLoading(true);
      const fetchUserData = async () => {
        try {
          const data = await getUserRole();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [initialUserData]);

  const signOut = async () => {
    await logOut();
    setUserData(null);
    router.refresh();
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const data = await getUserRole();
      setUserData(data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user: userData, signOut, isLoading, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
