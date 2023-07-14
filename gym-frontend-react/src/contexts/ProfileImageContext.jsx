import { createContext, useContext, useState, useEffect } from "react";
import { getUserByID } from "../api/user";
import { useAuthentication } from "../hooks/authentication";

const ProfileImageContext = createContext();

export function useProfileImage() {
  return useContext(ProfileImageContext);
}

export function ProfileImageProvider({ children }) {
  const [user] = useAuthentication();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user && user.user_id) {
      getUserByID(user.user_id)
        .then((data) => {
          const initialProfileImage = `http://localhost:8080/uploads/${data.user_image_path}`;
          setProfileImage(initialProfileImage);
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  const value = {
    profileImage,
    setProfileImage,
  };

  return (
    <ProfileImageContext.Provider value={value}>
      {children}
    </ProfileImageContext.Provider>
  );
}
