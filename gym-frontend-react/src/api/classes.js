import { API_URL } from "./api.js";

// // Get all classes by filter
// export async function getAllClassesByFilter(classFilter) {
//   // GET from the API /classes/filter
//   const response = await fetch(
//     API_URL +
//       "/classes/filter/activity/:activity_name/location/:room_location/trainer/:user_first_name/date/:class_date" +
//       classFilter,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const APIResponseObject = await response.json();

//   return APIResponseObject.classes;
// }

// Get all classes with details
export async function getAllClassesWithDetails() {
  // GET from the API /classes/details
  const response = await fetch(API_URL + "/classes/details", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.classes;
}

// Create a class with details
export async function createClassWithDetails(gymClass) {
  // POST to the API /classes/details
  const response = await fetch(API_URL + "/classes/details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gymClass),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.class;
}

// Get class by id with details
export async function getClassByIdWithDetails(id) {
  // GET from the API /classes/details/:id
  const response = await fetch(API_URL + "/classes/details/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.classDetails;
}

export async function getAllClasses() {
  // GET from the API /classes
  const response = await fetch(API_URL + "/classes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.classes;
}

export async function getClassById(id) {
  // GET from the API /class/:id
  const response = await fetch(API_URL + "/class/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.class;
}

// Update a class with details
export async function updateClassWithDetails(gymClass) {
  // PUT to the API /classes/details/:id
  const response = await fetch(API_URL + "/classes/details", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gymClass),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.class;
}

export async function updateClassById(id, classData) {
  // GET from the API /class/:id
  const response = await fetch(API_URL + "/class/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(classData),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.class;
}

export async function createClass(gymClass) {
  // GET from the API /class
  const response = await fetch(API_URL + "/class", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gymClass),
  });

  const postCreateClassResponse = await response.json();

  return postCreateClassResponse;
}

export async function deleteClassById(id) {
  const response = await fetch(API_URL + "/class/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deleteClassResponse = await response.json();

  return deleteClassResponse;
}
