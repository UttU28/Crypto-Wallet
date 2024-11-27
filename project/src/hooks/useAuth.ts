import create from 'zustand';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the import path as needed

interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Function to map Firebase user to our custom User type
const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  isVerified: firebaseUser.emailVerified,
});

export const useAuth = create<AuthState>((set) => {
  // Initialize state
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // User is signed in
      const user = mapFirebaseUserToUser(firebaseUser);
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      // User is signed out
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  });

  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = mapFirebaseUserToUser(userCredential.user);
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    signup: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = mapFirebaseUserToUser(userCredential.user);
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Signup failed:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    logout: async () => {
      set({ isLoading: true });
      try {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
      } catch (error) {
        console.error('Logout failed:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    updateProfile: async (data) => {
      set({ isLoading: true });
      try {
        // Implement actual profile update logic if needed
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      } catch (error) {
        console.error('Profile update failed:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

// Unsubscribe from auth state changes on component unmount (for cleanup)
useEffect(() => {
  return () => {
    unsubscribe();
  };
}, []);
