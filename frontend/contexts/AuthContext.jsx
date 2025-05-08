import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const user = localStorage.getItem("chatlyUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signup = (name, email, password) => {
    // In a real app, this would be an API call
    // For now, we'll just simulate it
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random`,
    };

    localStorage.setItem("chatlyUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
    return Promise.resolve(newUser);
  };

  // Sign in function
  const signin = (email, password) => {
    // In a real app, this would validate against an API
    // For demo, we'll accept any email/password with basic validation
    if (!email || !password) {
      return Promise.reject(new Error("Email and password are required"));
    }

    // Create a mock user based on the email
    const user = {
      id: "user_" + Date.now(),
      name: email.split("@")[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        email.split("@")[0]
      )}&background=random`,
    };

    localStorage.setItem("chatlyUser", JSON.stringify(user));
    setCurrentUser(user);
    return Promise.resolve(user);
  };

  // Sign out function
  const signout = () => {
    localStorage.removeItem("chatlyUser");
    setCurrentUser(null);
    return Promise.resolve();
  };

  const value = {
    currentUser,
    signup,
    signin,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
