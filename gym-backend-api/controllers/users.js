import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import { validate } from "../middleware/validator.js";
import auth from "../middleware/auth.js";
import { User } from "../models/user-object.js";
import {
  getAllUsers,
  getByEmail,
  getByAuthenticationKey,
  getUserByID,
  createUser,
  update,
  deleteUserByID,
  getAllTrainers,
  updateUserImagePath,
} from "../models/users.js";

const userController = Router();

// Update user image path endpoint
const updateUserImagePathSchema = {
  type: "object",
  required: ["imagePath", "userID"],
  properties: {
    user_image_path: {
      type: "string",
    },
    userID: {
      type: "string",
    },
  },
};

userController.put(
  "/users/image/:userID/:imagePath",
  validate({ params: updateUserImagePathSchema }),
  (req, res) => {
    // #swagger.summary = "Updates the user image path"
    /* #swagger.parameters['userID'] = {
            in: 'path',
            description: 'ID of the user',
            required: true,
            type: 'string'
        } */
    /* #swagger.parameters['imagePath'] = {
            in: 'path',
            description: 'Path of the image',
            required: true,
            type: 'string'
        } */
    /* #swagger.requestBody = {
            description: "Updates the user image path",
            content: {
                'application/json': {
                    schema: {
                        imagePath: 'images/users/1.jpg',
                        userID: '1',
                    }
                }
            }
        } */

    const userID = req.params.userID;
    const imagePath = req.params.imagePath;

    updateUserImagePath(userID, imagePath)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "user image path updated",
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "user image path update failed",
        });
      });
  }
);

//// User login endpoint
const postUserLoginSchema = {
  type: "object",
  required: ["user_email", "user_password"],
  properties: {
    user_email: {
      type: "string",
    },
    user_password: {
      type: "string",
    },
  },
};

userController.post(
  "/users/login",
  // validate({ body: postUserLoginSchema }),
  (req, res) => {
    // #swagger.summary = "Logs in the user"
    /* #swagger.requestBody = { ... } */

    // access request body
    let loginData = req.body;
    let email = loginData.email;

    getByEmail(email)
      .then((user) => {
        if (bcrypt.compareSync(loginData.password, user.user_password)) {
          // Clear the existing authentication_key
          user.authentication_key = null;

          // Set a new authentication_key
          user.authentication_key = uuid4().toString();

          update(user).then((result) => {
            res.status(200).json({
              status: 200,
              message: "user logged in",
              authenticationKey: user.authentication_key,
            });
          });
        } else {
          res.status(400).json({
            status: 400,
            message: "invalid credentials",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "login failed",
        });
      });
  }
);

//// User logout endpoint
const postUserLogoutSchema = {
  type: "object",
  required: ["authentication_key"],
  properties: {
    authentication_key: {
      type: "string",
    },
  },
};

userController.post(
  "/users/logout",
  validate({ body: postUserLogoutSchema }),
  (req, res) => {
    // #swagger.summary = "Logs out the user"
    /* #swagger.requestBody = {
            description: "Logs out the user",
            content: {
                'application/json': {
                    schema: {
                       authenticationKey: '88f76721-ff89-46f2-ac3a-c0c8a24d5625',
                    },
                    example: {
                        authenticationKey: '88f76721-ff89-46f2-ac3a-c0c8a24d5625',
                    }
                }
            }
        } */
    let authenticationKey = req.body.authentication_key;
    getByAuthenticationKey(authenticationKey)
      .then((user) => {
        user.authentication_key = null;
        update(user).then((user) => {
          res.status(200).json({
            status: 200,
            message: "user logged out",
          });
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "failed to logout user",
        });
      });
  }
);

// Get all users schema
userController.get("/users", auth(["admin", "trainer"]), async (req, res) => {
  // #swagger.summary = "Get all users"
  /* #swagger.requestBody = {
            description: "Gets all the users",
        } */
  const users = await getAllUsers();

  res.status(200).json({
    status: 200,
    message: "User list",
    users: users,
  });
});

// Get all trainers
userController.get(
  "/users/trainers",
  auth(["admin", "trainer"]),
  async (req, res) => {
    // #swagger.summary = "Get all trainers"
    /* #swagger.requestBody = {
            description: "Gets all the trainers",
        } */
    const users = await getAllTrainers();

    res.status(200).json({
      status: 200,
      message: "Trainer list",
      users: users,
    });
  }
);

//// Get user by ID endpoint
const getUserByIDSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

userController.get(
  "/users/:id",

  // auth(["member", "trainer", "admin"]),
  validate({ params: getUserByIDSchema }),

  (req, res) => {
    // #swagger.summary = "Get a user by id"
    /* #swagger.requestBody = {
            description: "Gets a user by id",
        } */
    const userID = req.params.id;

    getUserByID(userID)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Get user by ID",
          user: user,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to get user by ID",
        });
      });
  }
);

//// Get user by authentication key endpoint
const getUserByAuthenticationKeySchema = {
  type: "object",
  required: ["authenticationKey"],
  properties: {
    authenticationKey: {
      type: "string",
    },
  },
};

userController.get(
  "/users/by-key/:authenticationKey",
  validate({ params: getUserByAuthenticationKeySchema }),
  (req, res) => {
    const authenticationKey = req.params.authenticationKey;

    getByAuthenticationKey(authenticationKey)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Get user by authentication key",
          user: user,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to get user by authentication key",
        });
      });
  }
);

//// Create user endpoint
const createUserSchema = {
  type: "object",
  required: [
    "user_email",
    "user_password",
    "user_role",
    "user_phone",
    "user_first_name",
    "user_last_name",
    "user_address",
  ],
  properties: {
    user_email: {
      type: "string",
    },
    user_password: {
      type: "string",
    },
    user_role: {
      type: "string",
    },
    user_phone: {
      type: "string",
    },
    user_first_name: {
      type: "string",
    },
    user_last_name: {
      type: "string",
    },
    user_address: {
      type: "string",
    },
  },
};

userController.post(
  "/users",
  validate({ body: createUserSchema }),
  (req, res) => {
    // #swagger.summary = "Create a user"
    /* #swagger.requestBody = {
            description: "Creates a user",
            content: {
                'application/json': {
                    schema: {
                        user_email: 'string',
                       user_password: 'string',
                        user_role: 'string',
                        user_phone: 'string',
                        user_first_name: 'string',
                        user_last_name: 'string,',
                        user_address: 'string',
                    },
                    example: {
                        user_email: 'student@email.com',
                        user_password: 'abc123',
                        user_role: 'student',
                        user_phone: '1234567890',
                        user_first_name: 'test',
                        user_last_name: 'test',
                        user_address: '123 test street',
                    }
                }
            }
        } */
    // Get the user data out of the request
    const userData = req.body;

    // hash the password if it isn't already hashed
    if (!userData.user_password.startsWith("$2a")) {
      userData.user_password = bcrypt.hashSync(userData.user_password);
    }

    // Convert the user data into an User model object
    const user = User(
      null,
      userData.user_email,
      userData.user_password,
      userData.user_role,
      userData.user_phone,
      userData.user_first_name,
      userData.user_last_name,
      userData.user_address,
      null
    );

    // Use the create model function to insert this user into the DB
    createUser(user)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Created user",
          user: user,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to create user",
        });
      });
  }
);

//// Register user endpoint
const registerUserSchema = {
  type: "object",
  required: [
    "user_email",
    "user_password",
    "user_phone",
    "user_first_name",
    "user_last_name",
    "user_address",
    "user_image_path",
  ],
  properties: {
    user_email: {
      type: "string",
    },
    user_password: {
      type: "string",
    },
    user_phone: {
      type: "string",
    },
    user_first_name: {
      type: "string",
    },
    user_last_name: {
      type: "string",
    },
    user_address: {
      type: "string",
    },
    user_image_path: {
      type: "string",
    },
  },
};

userController.post(
  "/users/register",
  validate({ body: registerUserSchema }),
  (req, res) => {
    // #swagger.summary = "Register a user"
    /* #swagger.requestBody = {
      description: "Registers a user",
      content: {
        'application/json': {
          schema: {
            user_email: 'string',
            user_password: 'string',
            user_phone: 'string',
            user_first_name: 'string',
            user_last_name: 'string',
            user_address: 'string',
            user_image_path: 'string',
          },
          example: {
            user_email: 'member@email.com',
            user_password: 'abc123',
            user_phone: '1234567890',
            user_first_name: 'test',
            user_last_name: 'test',
            user_address: '123 test street',
            user_image_path: 'default_user.png',
          }
        }
      }
    } */

    // Get the user data out of the request
    const userData = req.body;

    // hash the password
    userData.user_password = bcrypt.hashSync(userData.user_password);

    // Convert the user data into an User model object
    const user = User(
      null,
      userData.user_email,
      userData.user_password,
      "member",
      userData.user_phone,
      userData.user_first_name,
      userData.user_last_name,
      userData.user_address,
      userData.user_image_path,
      null
    );

    // Use the create model function to insert this user into the DB
    createUser(user)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Registration successful",
          user: user,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Registration failed",
        });
      });
  }
);

//// Update user endpoint
const updateUserSchema = {
  type: "object",
  required: ["user_id"],
  properties: {
    user_id: {
      type: "number",
    },
    user_email: {
      type: "string",
    },
    user_password: {
      type: "string",
    },
    user_role: {
      type: "string",
    },
    user_phone: {
      type: "string",
    },
    user_first_name: {
      type: "string",
    },
    user_last_name: {
      type: "string",
    },
    user_address: {
      type: "string",
    },
  },
};

userController.patch(
  "/users",
  validate({ body: updateUserSchema }),
  async (req, res) => {
    // #swagger.summary = "Updates a user by id"
    /* #swagger.requestBody = {
      description: "Updates a user by id",
      content: {
        "application/json": {
          schema: {
            user_id: "string",
            user_email: "string",
            user_password: "string",
            user_role: "string",
            user_phone: "string",
            user_first_name: "string",
            user_last_name: "string,",
            user_address: "string",
          },
          example: {
            user_id: "1",
            user_email: 'trainer@email.com',
            user_password: 'abc123',
            user_role: 'trainer',
            user_phone: '1234567890',
            user_first_name: 'test',
            user_last_name: 'test',
            user_address: '123 test street',
          },
        },
      },
    } */
    const user = req.body;

    // hash the password if it isn't already hashed
    if (user.password && !user.password.startsWith("$2a")) {
      user.password = await bcrypt.hash(user.password);
    }

    // Use the update model function to update this user in the DB
    update(user)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Updated user",
          user: user,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to update user",
        });
      });
  }
);

//// Delete user by ID endpoint
const deleteUserByIDSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

userController.delete(
  "/users/:id",
  [auth(["admin", "trainer"]), validate({ params: deleteUserByIDSchema })],
  (req, res) => {
    // #swagger.summary = "Delete a user by id"
    const user_id = req.params.id;

    deleteUserByID(user_id)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "User deleted",
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to delete user",
        });
      });
  }
);

export default userController;
