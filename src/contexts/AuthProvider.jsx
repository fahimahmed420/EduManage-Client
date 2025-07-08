import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../../firebase.init';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  // Create user with email/password
  const createUser = async (email, password, fullName = '', photoURL = '') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName || photoURL) {
      await updateProfile(userCredential.user, {
        displayName: fullName,
        photoURL: photoURL,
      });
      setUser({ ...userCredential.user, displayName: fullName, photoURL }); 
    } else {
      setUser(userCredential.user);
    }
    return userCredential;
  };

  // Sign in user with email/password
  const signInUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    return userCredential;
  };

  // Google Sign In
  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
    return result;
  };

  // Sign out
  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  // password reset
  const passReset =async(email)=>{
    const result= await sendPasswordResetEmail(auth,email);
    return result;
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });

    return () => unsubscribe();
  }, []);

  const userInfo = {
    user,
    createUser,
    signInUser,
    signOutUser,
    signInWithGoogle,
    passReset
  };

  // Only show loading screen while user === undefined (not yet checked)
  if (user === undefined) {
    return (
      <div className="text-center text-white text-xl py-10">
        <h2 className="my-16">Checking authentication...</h2>
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
