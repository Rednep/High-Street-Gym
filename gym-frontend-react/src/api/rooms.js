import { API_URL } from "./api.js";

export async function getAllRooms() {
  // GET from the API /rooms
  const response = await fetch(API_URL + "/rooms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.rooms;
}

export async function getRoomByID(roomID) {
  // GET from the API /trail/:id
  const response = await fetch(API_URL + "/rooms/" + roomID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.room;
}

export async function createRoom(roomData) {
  const response = await fetch(API_URL + "/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  const postCreateRoomResponse = await response.json();

  return postCreateRoomResponse.room;
}

export async function updateRoomByID(roomID, roomData) {
  const response = await fetch(API_URL + "/rooms/" + roomID, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  const patchRoomResponse = await response.json();

  return patchRoomResponse.room;
}

export async function deleteRoomByID(roomID) {
  const response = await fetch(API_URL + "/rooms/" + roomID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deleteRoomResponse = await response.json();

  return deleteRoomResponse;
}
