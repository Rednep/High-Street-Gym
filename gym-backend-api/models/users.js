import { db } from "../database/db.js";
import { User } from "./user-object.js";

// Get a user by their authentication key
export async function getByAuthenticationKey(authenticationKey) {
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE authentication_key = ?",
    authenticationKey
  );

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve(
      User(
        userResult.user_id.toString(),
        userResult.user_email,
        userResult.user_password,
        userResult.user_role,
        userResult.user_phone,
        userResult.user_first_name,
        userResult.user_last_name,
        userResult.user_address,
        userResult.authentication_key
      )
    );
  } else {
    return Promise.reject("no results found");
  }
}

// Create a new user
export async function createUser(user) {
  return db
    .query(
      `
        INSERT INTO users 
        (user_email, 
          user_password, 
          user_role, 
          user_phone, 
          user_first_name, 
          user_last_name, 
          user_address,
          user_image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        user.user_email,
        user.user_password,
        user.user_role,
        user.user_phone,
        user.user_first_name,
        user.user_last_name,
        user.user_address,
        user.user_image_path,
      ]
    )
    .then(([result]) => {
      return { ...user };
    });
}

// Get all users
export async function getAllUsers() {
  const [allUserResults] = await db.query("SELECT * FROM users");

  return await allUserResults.map((userResult) =>
    User(
      userResult.user_id.toString(),
      userResult.user_email,
      userResult.user_password,
      userResult.user_role,
      userResult.user_phone,
      userResult.user_first_name,
      userResult.user_last_name,
      userResult.user_address,
      userResult.user_image_path,
      userResult.authentication_key
    )
  );
}

// Get all trainers
export async function getAllTrainers() {
  const [allTrainerResults] = await db.query(
    "SELECT user_first_name FROM users WHERE user_role = 'trainer'"
  );

  return await allTrainerResults.map((trainerResult) =>
    User(
      trainerResult.user_id,
      trainerResult.user_email,
      trainerResult.user_password,
      trainerResult.user_role,
      trainerResult.user_phone,
      trainerResult.user_first_name,
      trainerResult.user_last_name,
      trainerResult.user_address,
      trainerResult.authentication_key
    )
  );
}

// Get a user by it's ID
export async function getUserByID(userID) {
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    userID
  );

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve(
      User(
        userResult.user_id,
        userResult.user_email,
        userResult.user_password,
        userResult.user_role,
        userResult.user_phone,
        userResult.user_first_name,
        userResult.user_last_name,
        userResult.user_address,
        userResult.user_image_path,
        userResult.authentication_key
      )
    );
  } else {
    return Promise.reject("no results found");
  }
}

// Update a user by it's ID
export async function updateUserByID(userID, userData) {
  return db
    .query(
      `UPDATE users SET 
    user_email = ?, 
    user_password = ?, 
    user_role = ?, 
    user_phone = ?, 
    user_first_name = ?, 
    user_last_name = ?, 
    user_address = ? 
    WHERE user_id = ?
    `,
      [
        userData.user_email,
        userData.user_password,
        userData.user_role,
        userData.user_phone,
        userData.user_first_name,
        userData.user_last_name,
        userData.user_address,
        userID,
      ]
    )
    .then(([result]) => {
      return { ...userData };
    });
}

export async function update(user) {
  return db
    .query(
      `UPDATE users SET 
      user_email = ?, 
      user_password = ?, 
      user_role = ?, 
      user_phone = ?, 
      user_first_name = ?, 
      user_last_name = ?, 
      user_address = ?,
      authentication_key = ?
      WHERE user_id = ?
      `,
      [
        user.user_email,
        user.user_password,
        user.user_role,
        user.user_phone,
        user.user_first_name,
        user.user_last_name,
        user.user_address,
        user.authentication_key,
        user.user_id,
      ]
    )
    .then(([result]) => {
      return { ...user };
    });
}

// Delete a user by it's ID
export function deleteUserByID(user_id) {
  return db.query(`DELETE FROM users WHERE user_id = ?`, [user_id]);
}

export async function getByEmail(email) {
  const [userResults] = await db.query(
    `SELECT * FROM users WHERE user_email = ?`,
    email
  );

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve(
      User(
        userResult.user_id.toString(),
        userResult.user_email,
        userResult.user_password,
        userResult.user_role,
        userResult.user_phone,
        userResult.user_first_name,
        userResult.user_last_name,
        userResult.user_address,
        userResult.authentication_key
      )
    );
  } else {
    return Promise.reject("no results found");
  }
}

export async function updateUserImagePath(userID, imagePath) {
  return db.query(`UPDATE users SET user_image_path = ? WHERE user_id = ?`, [
    `${imagePath}`,
    userID,
  ]);
}
