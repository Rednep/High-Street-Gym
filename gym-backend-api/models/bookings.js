import { db } from "../database/db.js";
import { Booking } from "../models/booking-object.js";

// Create a booking
export async function createBooking(bookingData) {
  return db
    .query(
      `
        INSERT INTO bookings (booking_user_id, booking_class_id, booking_created_datetime)
        VALUES (?, ?, NOW())
    `,
      [
        bookingData.booking_user_id,
        bookingData.booking_class_id,
        new Date(bookingData.booking_datetime),
      ]
    )
    .then(([result]) => {
      return { ...bookingData };
    });
}

// Get all bookings
export async function getAllBookings() {
  const [allBookingResults] = await db.query("SELECT * FROM bookings");
  return await allBookingResults.map((bookingResult) =>
    Booking(
      bookingResult.booking_id,
      bookingResult.booking_user_id,
      bookingResult.booking_class_id,
      bookingResult.booking_created_datetime
    )
  );
}

// Get all bookings by the booking user id and return class details
export async function getAllBookingsByUserID(userID) {
  const [allBookingResults] = await db.query(
    `
      SELECT 
      bookings.booking_id,
      bookings.booking_class_id,
      bookings.booking_user_id, 
      activities.activity_name, 
      rooms.room_location, 
      users.user_first_name,
      classes.class_date, 
      classes.class_time
      FROM bookings
      INNER JOIN classes ON bookings.booking_class_id = classes.class_id
      INNER JOIN activities ON classes.class_activity_id = activities.activity_id 
      INNER JOIN rooms ON classes.class_room_id = rooms.room_id 
      INNER JOIN users ON classes.class_trainer_user_id = users.user_id 
      WHERE booking_user_id = ?
      ORDER BY class_date DESC
    `,
    [userID]
  );
  return allBookingResults.map((BookingResult) => ({
    booking_id: BookingResult.booking_id,
    activity_name: BookingResult.activity_name,
    room_location: BookingResult.room_location,
    trainer: BookingResult.user_first_name,
    class_date: new Date(BookingResult.class_date).toLocaleDateString(),
    class_time: BookingResult.class_time.substring(0, 5),
  }));
}

export async function isClassBookedByUser(userID, classID) {
  const [bookingResults] = await db.query(
    `
      SELECT 
      *
      FROM bookings
      WHERE booking_user_id = ? AND booking_class_id = ?
    `,
    [userID, classID]
  );

  // If there's at least one result, the class is booked by the user.
  return bookingResults.length > 0;
}

export async function getFutureBookingsNumber(userID) {
  const [allBookingResults] = await db.query(
    `
    SELECT COUNT(*) AS future_booked_classes
    FROM bookings
    INNER JOIN classes ON bookings.booking_class_id = classes.class_id
    WHERE booking_user_id = ? AND STR_TO_DATE(CONCAT(classes.class_date, ' ', classes.class_time), '%Y-%m-%d %H:%i:%s') > NOW();
    `,

    [userID]
  );
  return allBookingResults[0].future_booked_classes;
}

// Get all bookings and return class details and user details
// export async function getAllBookingsWithDetails() {
//   const [allBookingResults] = await db.query(
//     `
//       SELECT
//         bookings.booking_id,
//         users.user_id,
//         users.user_email,
//         classes.class_id,
//         classes.class_date,
//         classes.class_time,
//         activities.activity_name,
//         trainers.user_first_name AS trainer
//       FROM bookings
//       INNER JOIN users ON bookings.booking_user_id = users.user_id
//       INNER JOIN classes ON bookings.booking_class_id = classes.class_id
//       INNER JOIN activities ON classes.class_activity_id = activities.activity_id
//       INNER JOIN users AS trainers ON classes.class_trainer_user_id = trainers.user_id
//       WHERE bookings.booking_id = bookings.booking_id
//       ORDER BY class_date DESC
//     `
//   );
//   return allBookingResults.map((BookingResult) => ({
//     booking_id: BookingResult.booking_id,
//     user_id: BookingResult.user_id,
//     user_email: BookingResult.user_email,
//     class_id: BookingResult.class_id,
//     class_date: new Date(BookingResult.class_date).toLocaleDateString(),
//     class_time: BookingResult.class_time.substring(0, 5),
//     activity_name: BookingResult.activity_name,
//     trainer: BookingResult.trainer,
//   }));
// }

export async function getAllBookingsWithDetails(pageNumber, pageSize) {
  const offset = (parseInt(pageNumber) - 1) * parseInt(pageSize);
  const [allBookingResults] = await db.query(
    `
      SELECT
        bookings.booking_id,
        users.user_id,
        users.user_email,
        classes.class_id,
        classes.class_date,
        classes.class_time,
        activities.activity_name,
        trainers.user_first_name AS trainer
      FROM bookings
      INNER JOIN users ON bookings.booking_user_id = users.user_id
      INNER JOIN classes ON bookings.booking_class_id = classes.class_id
      INNER JOIN activities ON classes.class_activity_id = activities.activity_id
      INNER JOIN users AS trainers ON classes.class_trainer_user_id = trainers.user_id
      WHERE bookings.booking_id = bookings.booking_id
      ORDER BY class_date DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `,
    [pageSize, offset]
  );

  const [totalCountResult] = await db.query(
    `
      SELECT COUNT(*) as total
      FROM bookings
    `
  );

  return {
    bookings: allBookingResults.map((BookingResult) => ({
      booking_id: BookingResult.booking_id,
      user_id: BookingResult.user_id,
      user_email: BookingResult.user_email,
      class_id: BookingResult.class_id,
      class_date: new Date(BookingResult.class_date).toLocaleDateString(),
      class_time: BookingResult.class_time.substring(0, 5),
      activity_name: BookingResult.activity_name,
      trainer: BookingResult.trainer,
    })),
    total: totalCountResult[0].total,
  };
}

// Update a booking by id
export async function updateBookingById(bookingData) {
  return await db
    .query(
      `
            UPDATE bookings
            SET booking_user_id = ?, booking_class_id = ?, booking_created_datetime = ?
            WHERE booking_id = ?
        `,
      [
        bookingData.booking_user_id,
        bookingData.booking_class_id,
        bookingData.booking_created_datetime,
        bookingData.booking_id,
      ]
    )
    .then(([result]) => {
      return { ...bookingData };
    });
}

// Delete a booking by id
export function deleteBookingById(bookingID) {
  return db.query(
    `
            DELETE FROM bookings
            WHERE booking_id = ?
        `,
    [bookingID]
  );
}
