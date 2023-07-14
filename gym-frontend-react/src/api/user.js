import { API_URL } from "./api.js";

export async function updateUserImagePath(userID, imagePath) {
  const response = await fetch(
    API_URL + "/users/image/" + userID + "/" + imagePath,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profilePicture: imagePath,
      }),
    }
  );

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function login(email, password) {
  const response = await fetch(API_URL + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function logout(authentication_key) {
  const response = await fetch(API_URL + "/users/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authentication_key,
    }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function createUser(user) {
  const authenticationKey = localStorage.getItem("authentication_key");
  const response = await fetch(API_URL + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authenticationKey,
    },
    body: JSON.stringify(user),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function getAllUsers() {
  const authenticationKey = localStorage.getItem("authentication_key");
  // GET from the API /users
  const response = await fetch(API_URL + "/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authenticationKey,
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.users;
}

export async function getAllTrainers() {
  const authenticationKey = localStorage.getItem("authentication_key");
  // GET from the API /users/trainers
  const response = await fetch(API_URL + "/users/trainers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authenticationKey,
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.users;
}

export async function getUserByID(userID) {
  const authenticationKey = localStorage.getItem("authentication_key");
  const response = await fetch(API_URL + "/users/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authenticationKey,
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.user;
}

export async function getByAuthenticationKey(authenticationKey) {
  const response = await fetch(API_URL + "/users/by-key/" + authenticationKey, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.user;
}

export async function update(user) {
  const response = await fetch(API_URL + "/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const patchUserResult = await response.json();

  return patchUserResult;
}

export async function registerUser(user) {
  const response = await fetch(API_URL + "/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const patchUserResult = await response.json();

  return patchUserResult;
}

export async function deleteUserByID(user_id) {
  const authenticationKey = localStorage.getItem("authentication_key");
  const response = await fetch(API_URL + "/users/" + user_id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: authenticationKey,
    },
  });
}
