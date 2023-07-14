import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create express application
const port = 8080;
const app = express();

// Endable cross-origin resource sharing (CORS)
//
// CORS allows us to set what front-end URLs are allowed
// to access this API.
app.use(
  cors({
    // Allow all origins
    origin: true,
    // To limit origins need to specify in an array such as
    // origin: ["www.google.com", "tafeqld.edu.au"]
  })
);
// Enable JSON request parsing middleware
//
// Must be done before endpoints are defined.
app.use(express.json());

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// Import and enable swagger documentation pages
import docsRouter from "./middleware/swagger-doc.js";
app.use(docsRouter);

import userController from "./controllers/users.js";
app.use(userController);
import activityController from "./controllers/activities.js";
app.use(activityController);
import classController from "./controllers/classes.js";
app.use(classController);
import roomController from "./controllers/rooms.js";
app.use(roomController);
import bookingController from "./controllers/bookings.js";
app.use(bookingController);
import blogController from "./controllers/blog.js";
app.use(blogController);
// Import and use validation error handling middleware
import { validateErrorMiddleware } from "./middleware/validator.js";
app.use(validateErrorMiddleware);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/uploads", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let profilePicture = req.files.profilePicture;
  let uploadPath = path.join(__dirname, "/uploads/", profilePicture.name);

  // Use the mv() method to place the file somewhere on your server
  profilePicture.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send({ message: "File uploaded!", fileName: profilePicture.name });
  });
});

app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}`);
});
