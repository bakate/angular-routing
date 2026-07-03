export type UserRole = 'admin' | 'contributor';

export type AuthState = Readonly<{
  role: UserRole | null;
}>;
