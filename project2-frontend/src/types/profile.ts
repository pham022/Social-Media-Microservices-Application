import {createContext } from 'react';

export interface Profile {
  profileId?: number,
  username: string,
  email: string
  password: string,
  firstName?: string,
  lastName?: string,
  bio?: string,
  profilePic?: string,
  verification?: boolean,
  following?: Profiles
}

export type Profiles = Profile[];

export type AuthContextValue = {
  user: Profile | null;
  login: (name: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null> (null);
