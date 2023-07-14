import { Router } from "express";
import {
  getAllActivities,
  getActivityByName,
  getActivityByID,
  createActivity,
  updateActivityByID,
  deleteActivityByID,
} from "../models/activities.js";
import xml2js from "xml2js";
import auth from "../middleware/auth.js";
import { Activity } from "../models/activity-object.js";
import { validate } from "../middleware/validator.js";

const activityController = Router();

// Get all activities
activityController.get("/activities", (req, res) => {
  // #swagger.summary = 'Gets all activities'
  getAllActivities()
    .then((activities) => {
      res.status(200).json({
        status: 200,
        message: "Get all activities",
        activities: activities,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to get all activities",
      });
    });
});

// Get an activity by name
const getActivityByNameSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
  },
};

activityController.get(
  "/activities/:name",
  validate({ params: getActivityByNameSchema }),
  (req, res) => {
    // #swagger.summary = 'Get an activity by name'
    const activityName = req.params.name;

    getActivityByName(activityName)
      .then((activity) => {
        res.status(200).json({
          status: 200,
          message: "Get activity by name",
          activity: activity,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to get activity by name",
        });
      });
  }
);

// Get an activity by ID
const getActivityByIDSchema = {
  required: ["id"],
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

activityController.get(
  "/activity/:id",
  validate({ params: getActivityByIDSchema }),
  (req, res) => {
    // #swagger.summary = 'Get an activity by ID'
    /* #swagger.parameters['id'] = {
            description: 'Activity ID',
            in: 'path',
            required: true,
            type: 'string'
        } */
    const activityID = req.params.id;

    getActivityByID(activityID)
      .then((activity) => {
        res.status(200).json({
          status: 200,
          message: "Get activity by ID",
          activity: activity,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to get activity by ID",
        });
      });
  }
);

activityController.post(
  "/activities/upload/xml",
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
          const activityUpload = data["activity-upload"];
          const activityUploadAttributes = activityUpload["$"];
          const operation = activityUploadAttributes["operation"];
          // Slightly painful indexing to reach nested children
          const activitiesData = activityUpload["activities"][0].activity;

          if (operation == "insert") {
            Promise.all(
              activitiesData.map((activityData) => {
                // Convert the xml object into a model object
                const activityModel = Activity(
                  null,
                  activityData.activity_name.toString(),
                  activityData.activity_description.toString(),
                  activityData.activity_duration.toString()
                );
                // Return the promise of each creation query
                return createActivity(activityModel);
              })
            )
              .then((results) => {
                res.status(200).json({
                  status: 200,
                  message: "XML Upload insert successful",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status: 500,
                  message: "XML upload failed on database operation - " + error,
                });
              });
          } else if (operation == "update") {
            Promise.all(
              activitiesData.map((activityData) => {
                // Convert the xml object into a model object
                const activityModel = Activity(
                  activityData.id.toString(),
                  activityData.name.toString()
                );
                // Return the promise of each creation query
                return updateActivityByID(activityModel);
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

// Create an activity TEST!!!
const createActivitySchema = {
  type: "object",
  required: ["activity_name", "activity_description", "activity_duration"],
  properties: {
    activity_name: {
      type: "string",
    },
    activity_description: {
      type: "string",
    },
    activity_duration: {
      type: "string",
    },
  },
};

activityController.post(
  "/activities",
  validate({ body: createActivitySchema }),
  (req, res) => {
    // #swagger.summary = 'Creates an activity'
    /* #swagger.requestBody = {
                description: "Creates an activity",
                content: {
                    "application/json": {
                        schema: {
                             activity_name: "string",
                            activity_description: "string",
                            activity_duration: "string",
                        },
                        example: {
                            activity_name: "yoga",
                            activity_description: "yoga for beginners",
                            activity_duration: "60 minutes",
                        }
                    }
                }
            } */
    const activityData = req.body;

    createActivity(activityData)
      .then((activity) => {
        res.status(200).json({
          status: 200,
          message: "Created activity",
          activity: activity,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to create activity",
        });
      });
  }
);

// Update an activity by ID TEST!!!
const updateActivityByIDSchema = {
  type: "object",
  required: ["activity_id"],
  properties: {
    activity_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },

    activity_name: {
      type: "string",
    },
    activity_description: {
      type: "string",
    },
    activity_duration: {
      type: "string",
    },
  },
};

activityController.patch(
  "/activities",
  validate({ body: updateActivityByIDSchema }),
  (req, res) => {
    // #swagger.summary = 'Update an activity by ID'
    /* #swagger.requestBody = {
                description: "Update an activity by ID",
                content: {
                    "application/json": {
                        schema: {
                            activity_id: "string",
                            activity_name: "string",
                            activity_description: "string",
                            activity_duration: "string",
                        },
                        example: {
                            activity_id: "1",
                            activity_name: "yoga",
                            activity_description: "yoga for beginners",
                            activity_duration: "60 minutes",
                        }
                    }
                }
            } */
    const activityData = req.body;

    updateActivityByID(activityData)
      .then((activity) => {
        res.status(200).json({
          status: 200,
          message: "Updated activity by it's ID",
          activity: activity,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to update activity by ID",
        });
      });
  }
);

// Delete an activity by ID TEST!!!
const deleteActivityByIDSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

activityController.delete(
  "/activities",
  validate({ body: deleteActivityByIDSchema }),
  (req, res) => {
    // #swagger.summary = 'Delete an activity by ID'
    /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          id: "string"
        },
        example: {
          id: "1"
        }
      }
    }
  } */

    const activityID = req.body.id;
    deleteActivityByID(activityID)
      .then((activity) => {
        res.status(200).json({
          status: 200,
          message: "Deleted activity by it's ID",
          activity: activity,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to delete activity by ID",
        });
      });
  }
);

export default activityController;
