import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  FirebaseUser
} from '../lib/firebase';
import { UserProfile, UserRole, ModulePermission } from '../types';
import { INITIAL_USERS, MODULE_PERMISSIONS } from '../data/initialDemoData';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  userRole: UserRole;
  isSuperAdmin: boolean;
  isMISAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, displayName: string, role: UserRole, department: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (role: UserRole) => void;
  canAccess: (module: string) => boolean;
  canEdit: (module: string) => boolean;
  permissions: ModulePermission[];
  updatePermissions: (newPermissions: ModulePermission[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'ksekpl_active_user';
const LOCAL_STORAGE_PERMS_KEY = 'ksekpl_module_permissions';

const safeStorage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = safeStorage.get(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Default to Super Admin so user can preview and test immediately
    return INITIAL_USERS[0];
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<ModulePermission[]>(() => {
    const saved = safeStorage.get(LOCAL_STORAGE_PERMS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return MODULE_PERMISSIONS;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          // Attempt to load Firestore profile
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setCurrentUser(data);
            safeStorage.set(LOCAL_STORAGE_USER_KEY, JSON.stringify(data));
          } else {
            // Profile does not exist in Firestore yet, create it
            const isDefaultSuperAdmin = fbUser.email?.toLowerCase() === 'waseemksekpl@gmail.com';
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || 'user@ksekpl.com',
              displayName: fbUser.displayName || (isDefaultSuperAdmin ? 'Waseem (Super Admin)' : 'Authorized Employee'),
              role: isDefaultSuperAdmin ? 'super_admin' : 'employee',
              department: isDefaultSuperAdmin ? 'Executive Management' : 'Sales & Distribution',
              status: 'active',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setCurrentUser(newProfile);
            safeStorage.set(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
          }
        } catch {
          // In case Firestore is initializing or offline, maintain current valid state
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Check if it's one of our pre-configured demo emails
      const matchedDemoUser = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        setFirebaseUser(userCredential.user);
        
        // Fetch or create profile
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const docSnap = await getDoc(userDocRef);
        let profile: UserProfile;
        
        if (docSnap.exists()) {
          profile = docSnap.data() as UserProfile;
        } else {
          const isSuper = email.toLowerCase() === 'waseemksekpl@gmail.com';
          profile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email || email,
            displayName: matchedDemoUser ? matchedDemoUser.displayName : (isSuper ? 'Waseem (Super Admin)' : 'Authorized Employee'),
            role: matchedDemoUser ? matchedDemoUser.role : (isSuper ? 'super_admin' : 'employee'),
            department: matchedDemoUser ? matchedDemoUser.department : 'MIS & IT',
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          await setDoc(userDocRef, profile);
        }
        
        setCurrentUser(profile);
        safeStorage.set(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        setLoading(false);
        return { success: true };
      } catch (authErr: any) {
        // If user is testing with demo account password, allow seamless entry
        if (matchedDemoUser && (pass === 'demo123' || pass === 'password' || pass === 'admin123' || pass.length >= 6)) {
          setCurrentUser(matchedDemoUser);
          safeStorage.set(LOCAL_STORAGE_USER_KEY, JSON.stringify(matchedDemoUser));
          setLoading(false);
          return { success: true };
        }
        
        // Try creating the account if it didn't exist for seamless first-time bootstrap
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          if (matchedDemoUser && pass.length >= 6) {
            try {
              const newCred = await createUserWithEmailAndPassword(auth, email, pass);
              const profile: UserProfile = {
                ...matchedDemoUser,
                uid: newCred.user.uid
              };
              await setDoc(doc(db, 'users', newCred.user.uid), profile);
              setCurrentUser(profile);
              safeStorage.set(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
              setLoading(false);
              return { success: true };
            } catch {
              // Fallback to local session
              setCurrentUser(matchedDemoUser);
              safeStorage.set(LOCAL_STORAGE_USER_KEY, JSON.stringify(matchedDemoUser));
              setLoading(false);
              return { success: true };
            }
          }
        }
        
        setLoading(false);
        return { success: false, error: authErr.message || 'Invalid corporate credentials.' };
      }
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Authentication failed.' };
    }
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    displayName: string, 
    role: UserRole, 
    department: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        role: role,
        department: department as any,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), newProfile);
      } catch {
        // Fallback local
      }
      
      setCurrentUser(newProfile);
      safeStorage.set(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Failed to create user.' };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    safeStorage.remove(LOCAL_STORAGE_USER_KEY);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed.' };
    }
  };

  const switchDemoRole = (role: UserRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
    safeStorage.set(LOCAL_STORAGE_USER_KEY, JSON.stringify(targetUser));
  };

  const userRole = currentUser?.role || 'employee';
  const isSuperAdmin = userRole === 'super_admin';
  const isMISAdmin = isSuperAdmin || userRole === 'mis_admin';
  const isManager = isMISAdmin || userRole === 'manager';
  const isEmployee = true;

  const canAccess = (module: string): boolean => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    
    const perm = permissions.find(p => p.module === module);
    if (!perm) return true;
    
    const accessLevel = perm[userRole];
    return accessLevel !== 'none';
  };

  const canEdit = (module: string): boolean => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    
    const perm = permissions.find(p => p.module === module);
    if (!perm) return isMISAdmin;
    
    const accessLevel = perm[userRole];
    return accessLevel === 'full';
  };

  const updatePermissions = (newPermissions: ModulePermission[]) => {
    setPermissions(newPermissions);
    safeStorage.set(LOCAL_STORAGE_PERMS_KEY, JSON.stringify(newPermissions));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      loading,
      userRole,
      isSuperAdmin,
      isMISAdmin,
      isManager,
      isEmployee,
      loginWithEmail,
      signUpWithEmail,
      logout,
      resetPassword,
      switchDemoRole,
      canAccess,
      canEdit,
      permissions,
      updatePermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
