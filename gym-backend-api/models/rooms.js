import { db } from "../database/db.js";
import { Room } from "../models/room-object.js";

// Create a new room
export async function createRoom(roomData) {
  return db
    .query(
      `
        INSERT INTO rooms (room_location, room_number) 
        VALUES (?, ?)
    `,
      [roomData.room_location, roomData.room_number]
    )
    .then(([result]) => {
      return { ...roomData };
    });
}

// Get all rooms
export async function getAllRooms() {
  const [allRoomResults] = await db.query("SELECT * FROM rooms");
  return await allRoomResults.map((roomResult) =>
    Room(roomResult.room_id, roomResult.room_location, roomResult.room_number)
  );
}

// Get a room by it's id
export async function getRoomByID(roomID) {
  const [roomResults] = await db.query(
    "SELECT * FROM rooms WHERE room_id = ?",
    [roomID]
  );
  return await roomResults.map((roomResult) =>
    Room(roomResult.room_id, roomResult.room_location, roomResult.room_number)
  );
}

// Update a room by it's id
export async function updateRoomByID(roomData) {
  return db
    .query(
      `
            UPDATE rooms
            SET room_location = ?, room_number = ?
            WHERE room_id = ?
        `,
      [roomData.room_location, roomData.room_number, roomData.room_id]
    )
    .then(([result]) => {
      return { ...roomData };
    });
}

// Delete a room by it's id
export async function deleteRoomByID(roomID) {
  return db.query("DELETE FROM rooms WHERE room_id = ?", [roomID]);
}
