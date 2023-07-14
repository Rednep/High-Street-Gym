import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as apiLogin,
  logout as apiLogout,
  getByAuthenticationKey,
} from "../api/user";

export const AuthenticationContext = createContext(null);

export function AuthenticationProvider({ router, children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Handle case where the user is logged in and the page
  // is reloaded. Check localStorage to see if the authenticationKey
  // has been saved there, then attempt to load user by authenticationKey
  // to resume client side session. Redirect to root page if failed.
  useEffect(() => {
    if (authenticatedUser == null) {
      const authenticationKey = localStorage.getItem("authentication_key");
      if (authenticationKey) {
        getByAuthenticationKey(authenticationKey)
          .then((user) => {
            setAuthenticatedUser(user);
          })
          .catch((error) => {
            router.navigate("/");
          });
      } else {
        router.navigate("/");
      }
    }
  }, []);

  return (
    <AuthenticationContext.Provider
      value={[authenticatedUser, setAuthenticatedUser]}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  const [authenticatedUser, setAuthenticatedUser] = useContext(
    AuthenticationContext
  );

  async function login(email, password) {
    // Clear existing client side user record
    setAuthenticatedUser(null);
    // Attempt login and retrieve user if successful
    return apiLogin(email, password)
      .then((result) => {
        if (result.status == 200) {
          // Store auth key in case page is reloaded
          localStorage.setItem("authentication_key", result.authenticationKey);
          // Fetch logged in user from backend
          return getByAuthenticationKey(result.authenticationKey).then(
            (user) => {
              setAuthenticatedUser(user);
              return Promise.resolve(result.message);
            }
          );
        } else {
          return Promise.reject(result.message);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  async function logout() {
    const authenticationKey = localStorage.getItem("authentication_key");
    if (authenticationKey) {
      return apiLogout(authenticationKey).then((result) => {
        localStorage.removeItem("authentication_key");
        setAuthenticatedUser(null);
        return Promise.resolve(result.message);
      });
    }
  }

  // async function logout() {
  //   localStorage.removeItem("authentication_key");
  //   if (authenticatedUser) {
  //     return apiLogout(authenticatedUser.authentication_key).then((result) => {
  //       setAuthenticatedUser(null);
  //       return Promise.resolve(result.message);
  //     });
  //   }
  // }

  return [authenticatedUser, login, logout];
}
