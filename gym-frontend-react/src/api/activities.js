import { API_URL } from "./api.js";

export async function getAllActivities() {
  // GET from the API /activities
  const response = await fetch(API_URL + "/activities", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.activities;
}

export async function getActivityByID(activityID) {
  // GET from the API /animal/:id
  const response = await fetch(API_URL + "/activity/" + activityID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.activity;
}

export async function createActivity(activity) {
  const response = await fetch(API_URL + "/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });

  const postCreateActivityResponse = await response.json();

  return postCreateActivityResponse.activity;
}

export async function updateActivityByID(activityID, activityData) {
  const response = await fetch(API_URL + "/activities" + activityID, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activityData),
  });

  const patchActivityResponse = await response.json();

  return patchActivityResponse.activity;
}

export async function deleteActivity(activityID) {
  const response = await fetch(API_URL + "/activities", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activityID),
  });

  const deleteActivityResponse = await response.json();

  return deleteActivityResponse;
}
