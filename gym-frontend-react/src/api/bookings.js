import { API_URL } from "./api.js";

export async function getAllBookings() {
  // GET from the API /bookings
  const response = await fetch(API_URL + "/bookings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.bookings;
}

// export async function getAllBookingsWithDetails() {
//   const authenticationKey = localStorage.getItem("authentication_key");
//   // GET from the API /bookings
//   const response = await fetch(API_URL + "/bookings/details", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: authenticationKey,
//     },
//   });

//   const APIResponseObject = await response.json();

//   return APIResponseObject.bookings;
// }

export async function getAllBookingsWithDetails(pageNumber = 1, pageSize = 10) {
  const authenticationKey = localStorage.getItem("authentication_key");
  // GET from the API /bookings
  const response = await fetch(
    API_URL +
      "/bookings/details?pageNumber=" +
      pageNumber +
      "&pageSize=" +
      pageSize,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authenticationKey,
      },
    }
  );

  const APIResponseObject = await response.json();

  return {
    bookings: APIResponseObject.bookings,
    total: APIResponseObject.total,
  };
}

export async function getAllBookingsByUserID(userID) {
  const authenticationKey = localStorage.getItem("authentication_key");
  // GET from the API /bookings/:userID
  const response = await fetch(API_URL + "/bookings/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authenticationKey,
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.bookings;
}

export async function isClassBookedByUser(userID, classID) {
  const authenticationKey = localStorage.getItem("authentication_key");
  // GET from the API /bookings/:userID/classes/:classID
  const response = await fetch(
    `${API_URL}/bookings/${userID}/classes/${classID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authenticationKey,
      },
    }
  );

  const APIResponseObject = await response.json();

  return APIResponseObject.isBooked;
}

export async function getFutureBookingsNumber(userID) {
  // GET from the API /bookings
  const response = await fetch(API_URL + "/bookings/number/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function createBooking(bookingData) {
  const authenticationKey = localStorage.getItem("authentication_key");
  // GET from the API /bookings
  const response = await fetch(API_URL + "/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authenticationKey,
    },
    body: JSON.stringify(bookingData),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function updateBookingById(bookingData) {
  // GET from the API /bookings
  const response = await fetch(API_URL + "/booking", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const patchBookingResult = await response.json();

  return patchBookingResult;
}

export async function deleteBookingById(bookingID) {
  // GET from the API /bookings
  const response = await fetch(API_URL + "/bookings/" + bookingID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deleteBookingResult = await response.json();

  return deleteBookingResult;
}
