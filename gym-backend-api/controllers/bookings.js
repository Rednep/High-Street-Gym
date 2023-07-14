import { Router } from "express";
import { validate } from "../middleware/validator.js";
import {
  createBooking,
  getAllBookings,
  getAllBookingsByUserID,
  getAllBookingsWithDetails,
  updateBookingById,
  deleteBookingById,
  getFutureBookingsNumber,
  isClassBookedByUser,
} from "../models/bookings.js";
import auth from "../middleware/auth.js";

const bookingController = Router();

// Get all bookings
// bookingController.get("/bookings", (req, res) => {
//   // #swagger.summary = 'Gets all bookings'
//   getAllBookings()
//     .then((bookings) => {
//       res.status(200).json({
//         status: 200,
//         message: "Get all bookings",
//         bookings: bookings,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json({
//         status: 500,
//         message: "Failed to get all bookings",
//       });
//     });
// });

// Get all bookings with details
bookingController.get(
  "/bookings/details",
  auth(["trainer", "admin"]),
  (req, res) => {
    // #swagger.summary = 'Gets all bookings with details'
    // #swagger.description = 'Endpoint to get all bookings with details.'
    const { pageNumber, pageSize } = req.query;
    getAllBookingsWithDetails(pageNumber, pageSize)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "Get all bookings with details",
          bookings: result.bookings,
          total: result.total,
        });
      })
      .catch((error) => {
        console.log(`Controller error: ${error}`);
        res.status(500).json({
          status: 500,
          message: "Failed to get all bookings with details",
        });
      });
  }
);

// Get all bookings by user id
const getBookingsByUserIDSchema = {
  type: "object",
  properties: {
    userID: {
      type: "string",
      // pattern: "^[0-9]+$",
    },
  },
};

bookingController.get(
  "/bookings/:userID",
  [
    auth(["member", "admin", "trainer"]),
    validate({ params: getBookingsByUserIDSchema }),
  ],
  (req, res) => {
    // #swagger.summary = 'Get all bookings by user id'
    const userID = req.params.userID;

    getAllBookingsByUserID(userID)
      .then((bookings) => {
        res.status(200).json({
          status: 200,
          message: "Get all bookings by user id",
          bookings: bookings,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to get all bookings by user id",
        });
      });
  }
);

const isClassBookedByUserSchema = {
  type: "object",
  properties: {
    userID: {
      type: "string",
    },
    classID: {
      type: "string",
    },
  },
};

bookingController.get(
  "/bookings/:userID/classes/:classID",
  [
    auth(["member", "admin", "trainer"]),
    validate({ params: isClassBookedByUserSchema }),
  ],
  (req, res) => {
    // #swagger.summary = 'Check if a class is booked by a user'
    const userID = req.params.userID;
    const classID = req.params.classID;

    isClassBookedByUser(userID, classID)
      .then((isBooked) => {
        res.status(200).json({
          status: 200,
          message: "Checked if class is booked by user",
          isBooked: isBooked,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to check if class is booked by user",
        });
      });
  }
);

bookingController.get("/bookings/number/:id", (req, res) => {
  // #swagger.summary = 'Get future bookings number by user id'
  const userID = req.params.id;

  getFutureBookingsNumber(userID)
    .then((bookings) => {
      res.status(200).json({
        status: 200,
        message: "Get future bookings number by user id",
        bookings: bookings,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to get future bookings number by user id",
      });
    });
});

// Create a new booking
const createBookingSchema = {
  type: "object",
  properties: {
    booking_user_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    booking_class_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    booking_datetime: {
      type: "string",
    },
  },
};

bookingController.post(
  "/booking",
  [
    auth(["admin", "trainer", "member"]),
    validate({ body: createBookingSchema }),
  ],
  (req, res) => {
    // #swagger.summary = 'Creates a booking'
    /* #swagger.requestBody = {
                description: "Creates a booking",
                content: {
                    "application/json": {
                        schema: {
                            booking_user_id: "string",
                            booking_class_id: "string",
                            booking_datetime: "string",
                        },
                        example: {
                            booking_user_id: "1",
                            booking_class_id: "1",
                            booking_datetime: "2023-04-04 12:00:00",
                        }
                    }
                }
            } */
    const bookingData = req.body;
    createBooking(bookingData)
      .then((booking) => {
        res.status(200).json({
          status: 200,
          message: "Booking created",
          booking: booking,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to create booking",
        });
      });
  }
);

const updateBookingByIdSchema = {
  type: "object",
  properties: {
    booking_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    user_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    class_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    booking_created_datetime: {
      type: "string",
    },
  },
};

// Update a booking by id
bookingController.patch(
  "/booking",
  validate({ body: updateBookingByIdSchema }),
  async (req, res) => {
    // #swagger.summary = 'Updates a booking by id'
    /* #swagger.requestBody = {
                description: "Updates a booking by id",
                content: {
                    "application/json": {
                        schema: {
                            booking_id: "string",
                             booking_user_id: "string",
                            booking_class_id: "string",
                            booking_created_datetime: "string",
                        },
                        example: {
                            booking_id: "1",
                             booking_user_id: "1",
                            booking_class_id: "1",
                            booking_created_datetime: "2023-04-04 12:00:00",
                        }
                    }
                }
            } */
    const bookingData = req.body;
    updateBookingById(bookingData)
      .then((booking) => {
        res.status(200).json({
          status: 200,
          message: "Booking updated",
          booking: booking,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to update booking",
        });
      });
  }
);

// Delete a booking by id
const deleteBookingByIdSchema = {
  required: ["bookingID"],
  type: "object",
  properties: {
    bookingID: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

bookingController.delete(
  "/bookings/:bookingID",
  validate({ params: deleteBookingByIdSchema }),
  async (req, res) => {
    // #swagger.summary = 'Deletes a booking by id'
    /* #swagger.description = 'Endpoint to delete a booking by id.' */
    const bookingID = req.params.bookingID;
    deleteBookingById(bookingID)
      .then((booking) => {
        res.status(200).json({
          status: 200,
          message: "Booking deleted",
          booking: booking,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to delete booking",
        });
      });
  }
);

export default bookingController;
