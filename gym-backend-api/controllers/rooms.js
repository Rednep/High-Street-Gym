import { Router } from "express";
import { validate } from "../middleware/validator.js";
import {
  createRoom,
  getAllRooms,
  getRoomByID,
  updateRoomByID,
  deleteRoomByID,
} from "../models/rooms.js";
import auth from "../middleware/auth.js";
import { Room } from "../models/room-object.js";
import xml2js from "xml2js";

const roomController = Router();

// Create a new room
const createRoomSchema = {
  type: "object",
  properties: {
    room_location: {
      type: "string",
    },
    room_number: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

roomController.post(
  "/rooms",
  [auth(["admin", "trainer"]), validate({ body: createRoomSchema })],
  (req, res) => {
    // #swagger.summary = 'Creates a room'
    /* #swagger.requestBody = {
                description: "Creates a room",
                content: {
                    "application/json": {
                        schema: {
                            room_location: "string",
                            room_number: "string",
                        },
                        example: {
                            room_location: "wynnum",
                            room_number: "1",
                        }
                    }
                }
            } */
    const roomData = req.body;
    createRoom(roomData)
      .then((room) => {
        res.status(200).json({
          status: 200,
          message: "Room created",
          room: room,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to create room",
        });
      });
  }
);

// Get all rooms
roomController.get("/rooms", (req, res) => {
  // #swagger.summary = 'Gets all rooms'
  getAllRooms()
    .then((rooms) => {
      res.status(200).json({
        status: 200,
        message: "Get all rooms",
        rooms: rooms,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to get all rooms",
      });
    });
});

// Get a room by ID
const getRoomByIDSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

roomController.get(
  "/rooms/:id",
  validate({ params: getRoomByIDSchema }),
  (req, res) => {
    // #swagger.summary = 'Get a room by ID'
    /* #swagger.parameters['id'] = { 
            description: 'Room ID', 
            in: 'path', 
            required: true, 
            type: 'integer' 
        } */
    const roomID = req.params.id;

    getRoomByID(roomID)
      .then((room) => {
        res.status(200).json({
          status: 200,
          message: "Get room by ID",
          room: room,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to get room by ID",
        });
      });
  }
);

// Update a room by ID TEST!!!
const updateRoomByIDSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    room_location: {
      type: "string",
    },
    room_number: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

// Room xml upload endpoint
roomController.post(
  "/rooms/upload/xml",
  auth(["admin", "trainer"]),
  (req, res) => {
    if (req.files && req.files["xml-file"]) {
      // Access the XML file as a string
      const XMLFile = req.files["xml-file"];
      const file_text = XMLFile.data.toString();

      // Set up XML parser
      const parser = new xml2js.Parser();
      parser
        .parseStringPromise(file_text)
        .then((data) => {
          const roomUpload = data["rooms-upload"];
          const roomUploadAttributes = roomUpload["$"];
          const operation = roomUploadAttributes["operation"];
          // Slightly painful indexing to reach nested children
          const roomsData = roomUpload["rooms"][0].room;

          if (operation == "insert") {
            Promise.all(
              roomsData.map((roomData) => {
                // Convert the xml object into a model object
                const roomModel = Room(
                  null,
                  roomData.room_location.toString(),
                  roomData.room_number.toString()
                );
                // Return the promise of each creation query
                return createRoom(roomModel);
              })
            )
              .then((results) => {
                res.status(200).json({
                  status: 200,
                  message: "XML Upload insert successful",
                });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({
                  status: 500,
                  message: "XML upload failed on database operation - " + error,
                });
              });
          } else if (operation == "update") {
            Promise.all(
              roomsData.map((roomData) => {
                // Convert the xml object into a model object
                const roomModel = Room(
                  roomData.room_id.toString(),
                  roomData.room_location.toString(),
                  roomData.room_number.toString()
                );
                // Return the promise of each creation query
                return roomModel.update(roomModel);
              })
            )
              .then((results) => {
                res.status(200).json({
                  status: 200,
                  message: "XML Upload update successful",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status: 500,
                  message: "XML upload failed on database operation - " + error,
                });
              });
          } else {
            res.status(400).json({
              status: 400,
              message: "XML Contains invalid operation element value",
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status: 500,
            message: "Error parsing XML - " + error,
          });
        });
    } else {
      res.status(400).json({
        status: 400,
        message: "No file selected",
      });
    }
  }
);

roomController.patch(
  "/rooms",
  validate({ body: updateRoomByIDSchema }),
  (req, res) => {
    // #swagger.summary = 'Update a room by ID'
    /* #swagger.requestBody = {
            description: "Update a room by ID",
            content: {
                "application/json": {
                    schema: {
                        room_id: "string",
                        room_location: "string",
                        room_number: "string",
                    },
                    example: {
                        room_id: "1",
                        room_location: "wynnum",
                        room_number: "1",
                    }
                }
            }
        } */
    const roomData = req.body;

    updateRoomByID(roomData)
      .then((room) => {
        res.status(200).json({
          status: 200,
          message: "Update room by ID",
          room: room,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to update room by ID",
        });
      });
  }
);

// Delete a room by ID
const deleteRoomByIDSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

roomController.delete(
  "/rooms/:id",
  validate({ params: deleteRoomByIDSchema }),
  (req, res) => {
    // #swagger.summary = 'Delete a room by ID'
    /* #swagger.parameters['id'] = {
                description: 'Room ID',
                in: 'path',
                required: true,
                type: 'string'
            } */
    const roomID = req.params.id;

    deleteRoomByID(roomID)
      .then((room) => {
        res.status(200).json({
          status: 200,
          message: "Delete room by ID",
          room: room,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to delete room by ID",
        });
      });
  }
);

export default roomController;
