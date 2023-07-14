import { Router } from "express";
import { validate } from "../middleware/validator.js";
import {
  createClass,
  getAllClasses,
  getClassById,
  getAllClassesWithDetails,
  updateClassById,
  deleteClassById,
  createClassWithDetails,
  updateClassWithDetails,
  getClassByIdWithDetails,
} from "../models/classes.js";

const classController = Router();

// Create a class
const createClassSchema = {
  type: "object",
  properties: {
    class_activity_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    class_room_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    class_trainer_user_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    class_date: {
      type: "string",
    },
    class_time: {
      type: "string",
    },
  },
};

classController.post(
  "/class",
  validate({ body: createClassSchema }),
  async (req, res) => {
    // #swagger.summary = 'Creates a class'
    /* #swagger.requestBody = {
            description: "Creates a class",
            content: {
                "application/json": {
                    schema: {
                        class_activity_id: "string",
                        class_room_id: "string",
                        class_trainer_user_id: "string",
                        class_date: "string",
                        class_time: "string",
                    },
                    example: {
                        class_activity_id: "1",
                        class_room_id: "1",
                        class_trainer_user_id: "2",
                        class_date: "2023-04-04",
                        class_time: "00:00:00",
                    }
                }
            }
        } */
    const gymClass = req.body;

    createClass(gymClass)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "Class created",
          class: result,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to create class",
        });
      });
  }
);

// Get all classes
classController.get("/classes", (req, res) => {
  // #swagger.summary = 'Get all classes'
  getAllClasses()
    .then((classes) => {
      res.status(200).json({
        status: 200,
        message: "Get all classes",
        classes: classes,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get all classes",
      });
    });
});

// Get a class by id
const getClassByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

classController.get(
  "/class/:id",
  validate({ params: getClassByIdSchema }),
  async (req, res) => {
    // #swagger.summary = 'Get a class by id'
    /* #swagger.parameters['id'] = {
            description: "Class id",
            in: "path",
            required: true,
            type: "string"
        } */
    const id = req.params.id;

    getClassById(id).then((gymClass) => {
      res.status(200).json({
        status: 200,
        message: "Get a class by id",
        class: gymClass,
      });
    });
  }
);

// Get all classes by filter
// const getAllClassesByFilterSchema = {
//   type: "object",
//   properties: {
//     activity_name: {
//       type: "string",
//     },
//     room_location: {
//       type: "string",
//     },
//     user_first_name: {
//       type: "string",
//     },
//     class_date: {
//       type: "string",
//     },
//   },
// };

// classController.get(
//   "/classes/filter/activity/:activity_name/location/:room_location/trainer/:user_first_name/date/:class_date",
//   validate({ params: getAllClassesByFilterSchema }),
//   (req, res) => {
//     // #swagger.summary = 'Get all classes by filter'
//     /* #swagger.parameters['activity_name'] = {
//             description: "Activity name",
//             in: "path",
//             required: true,
//             type: "string"
//         } */
//     /* #swagger.parameters['room_location'] = {
//             description: "Room location",
//             in: "path",
//             required: true,
//             type: "string"
//         } */
//     /* #swagger.parameters['user_first_name'] = {
//             description: "Trainer first name",
//             in: "path",
//             required: true,
//             type: "string"
//         } */
//     /* #swagger.parameters['class_date'] = {
//             description: "Class date",
//             in: "path",
//             required: true,
//             type: "string"
//         } */

//     const classFilter = req.params;
//     console.log(classFilter);
//     getAllClassesByFilter(classFilter)
//       .then((classes) => {
//         console.log(classes);
//         res.status(200).json({
//           status: 200,
//           message: "Get all classes by filter",
//           classes: classes,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).json({
//           status: 500,
//           message: "Failed to get all classes by filter",
//         });
//       });
//   }
// );

// Get all classes with details
classController.get("/classes/details", async (req, res) => {
  // #swagger.summary = 'Get all classes with details'
  getAllClassesWithDetails()
    .then((classes) => {
      res.status(200).json({
        status: 200,
        message: "Get all classes by class id",
        classes: classes,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to get all classes by class id",
      });
    });
});

// Create a class with details
// const createClassWithDetailsSchema = {
//   type: "object",
//   properties: {
//     class_activity_id: {
//       type: "string",
//       pattern: "^[0-9]+$",
//     },
//     class_room_id: {
//       type: "string",
//       pattern: "^[0-9]+$",
//     },
//     class_trainer_user_id: {
//       type: "string",
//       pattern: "^[0-9]+$",
//     },
//     class_date: {
//       type: "string",
//     },
//     class_time: {
//       type: "string",
//     },
//   },
// };

classController.post(
  "/classes/details",
  // validate({ body: createClassWithDetailsSchema }),
  async (req, res) => {
    // #swagger.summary = 'Create a class with details'
    /* #swagger.requestBody = {
            description: "Create a class with their details",
            content: {
                "application/json": {
                    schema: {
                        class_activity_name: "Yoga",
                        class_room_number: "1",
                        class_trainer_first_name: "John",
                        class_date: "2021-05-01",
                        class_time: "10:00:00"
                    },
                    example: {
                        class_activity_name: "Yoga",
                        class_room_number: "1",
                        class_trainer_first_name: "Arnold",
                        class_date: "2023-05-01",
                        class_time: "10:00:00"
                    }   
                }
            }
        } */
    const gymClass = req.body;

    createClassWithDetails(gymClass)
      .then((classDetails) => {
        res.status(200).json({
          status: 200,
          message: "Create a class with details",
          classDetails: classDetails,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to create a class with details",
        });
      });
  }
);

// Update a class with details
classController.patch("/classes/details", async (req, res) => {
  // #swagger.summary = 'Update a class with details'
  /* #swagger.requestBody = {
          description: "Update a class with their details",
          content: {
              "application/json": {
                  schema: {
                      class_id: "string",
                      class_activity_name: "string",
                      class_room_number: "string",
                      class_trainer_first_name: "string",
                      class_date: "string",
                      class_time: "string"
                  },
                  example: {
                      class_id: "1",
                      class_activity_name: "Yoga",
                      class_room_number: "1",
                      class_trainer_first_name: "Chuck",
                      class_date: "2021-05-01",
                      class_time: "10:00:00"
                  }
              }
          }
      } */
  const gymClass = req.body;

  updateClassWithDetails(gymClass)
    .then((classDetails) => {
      res.status(200).json({
        status: 200,
        message: "Update a class with details",
        classDetails: classDetails,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to update a class with details",
      });
    });
});

// Get class by id with details
classController.get("/classes/details/:id", async (req, res) => {
  // #swagger.summary = 'Get class by id with details'
  /* #swagger.parameters['id'] = {
          in: 'path',
          description: 'Class ID',
          required: true,
          type: 'string'
  } */
  const id = req.params.id;

  getClassByIdWithDetails(id)
    .then((classDetails) => {
      res.status(200).json({
        status: 200,
        message: "Get class by id with details",
        classDetails: classDetails,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to get class by id with details",
      });
    });
});

// class xml upload endpoint
classController.post("/classes/upload/xml", (req, res) => {
  if (req.files && req.files["xml-file"]) {
    // Access the XML file as a string
    const XMLFile = req.files["xml-file"];
    const file_text = XMLFile.data.toString();

    // Set up XML parser
    const parser = new xml2js.Parser();
    parser
      .parseStringPromise(file_text)
      .then((data) => {
        const classUpload = data["class-upload"];
        const classUploadAttributes = classUpload["$"];
        const operation = classUploadAttributes["operation"];
        // Slightly painful indexing to reach nested children
        const classsData = classUpload["classs"][0].class;

        if (operation == "insert") {
          Promise.all(
            classsData.map((classData) => {
              // Convert the xml object into a model object
              const classModel = Class(
                null,
                classData.class_activity_id.toString(),
                classData.class_room_id.toString(),
                classData.class_trainer_user_id.toString(),
                classData.class_date.toString(),
                classData.class_time.toString()
              );
              // Return the promise of each creation query
              return classModel.createClass(classModel);
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
            classsData.map((classData) => {
              // Convert the xml object into a model object
              const classModel = Class(
                classData.class_id.toString(),
                classData.class_activity_id.toString(),
                classData.class_room_id.toString(),
                classData.class_trainer_user_id.toString(),
                classData.class_date.toString(),
                classData.class_time.toString()
              );
              // Return the promise of each creation query
              return classModel.update(classModel);
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
});

const updateClassByIdSchema = {
  type: "object",
  properties: {
    class_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    class_activity_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    class_room_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    class_trainer_user_id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    class_date: {
      type: "string",
    },
    class_time: {
      type: "string",
    },
  },
};
classController.patch(
  "/class/:id",
  validate({ body: updateClassByIdSchema }),
  async (req, res) => {
    // #swagger.summary = 'Update a class by id'
    /* #swagger.requestBody = {
            description: "Update a class by id",
            content: {
                "application/json": {
                    schema: {
                        class_id: "string",
                        class_activity_id: "string",
                        class_room_id: "string",
                        class_trainer_user_id: "string",
                        class_date: "string",
                        class_time: "string",
                    },
                    example: {
                        class_id: "1",
                        class_activity_id: "1",
                        class_room_id: "1",
                        class_trainer_user_id: "1",
                        class_date: "2023-04-04",
                        class_time: "00:00:00",
                    }
                }
            }
        } */
    const id = req.params.id;
    const classData = req.body;

    updateClassById(id, classData)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "Get class by id",
          class: result,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to get class by id",
        });
      });
  }
);

// Delete a class by id
const deleteClassByIdSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
  },
};

classController.delete(
  "/class/:id",
  validate({ params: deleteClassByIdSchema }),
  async (req, res) => {
    // #swagger.summary = 'Delete a class by id'
    /* #swagger.parameters['id'] = {
            description: "Class id",
            in: "path",
            required: true,
            type: "string"
        } */
    const id = req.params.id;

    deleteClassById(id)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "Class deleted",
          class: result,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to delete class",
        });
      });
  }
);

export default classController;
