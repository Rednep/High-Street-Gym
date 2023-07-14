import { db } from "../database/db.js";
import { Class } from "./class-object.js";

// Create a class where the room id is ? the activity id is ? and the user id is?
export async function createClass(gymClass) {
  return db
    .query(
      `
        INSERT INTO classes 
        (class_activity_id, class_room_id, class_trainer_user_id, class_date, class_time)
        VALUES (?,?,?,?,?)
    `,
      [
        gymClass.class_activity_id,
        gymClass.class_room_id,
        gymClass.class_trainer_user_id,
        gymClass.class_date,
        gymClass.class_time,
      ]
    )
    .then(() => {
      return { ...gymClass };
    });
}

// Insert into classes class_activity_id WHERE activity_name = ?, class_room_id WHERE room_number = ?, class_trainer_user_id WHERE user_first_name = ?, class_date = ?, class_time = ?
export async function createClassWithDetails(gymClass) {
  const [[activity]] = await db.query(
    "SELECT activity_id FROM activities WHERE activity_name = ?",
    [gymClass.class_activity_name]
  );
  const [[room]] = await db.query(
    "SELECT room_id FROM rooms WHERE room_number = ?",
    [gymClass.class_room_number]
  );
  const [[trainer]] = await db.query(
    "SELECT user_id FROM users WHERE user_first_name = ?",
    [gymClass.class_trainer_first_name]
  );

  const classResult = await db.query(
    `
      INSERT INTO classes
      (class_activity_id, class_room_id, class_trainer_user_id, class_date, class_time)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      activity.activity_id,
      room.room_id,
      trainer.user_id,
      gymClass.class_date,
      gymClass.class_time,
    ]
  );

  return {
    class_activity_id: activity.activity_id,
    class_room_id: room.room_id,
    class_trainer_user_id: trainer.user_id,
    class_date: gymClass.class_date,
    class_time: gymClass.class_time,
  };
}

export async function updateClassWithDetails(gymClass) {
  const [[activity]] = await db.query(
    "SELECT activity_id FROM activities WHERE activity_name = ?",
    [gymClass.class_activity_name]
  );
  const [[room]] = await db.query(
    "SELECT room_id FROM rooms WHERE room_number = ?",
    [gymClass.class_room_number]
  );
  const [[trainer]] = await db.query(
    "SELECT user_id FROM users WHERE user_first_name = ?",
    [gymClass.class_trainer_first_name]
  );

  const classResult = await db.query(
    `
      UPDATE classes
      SET
        class_activity_id = ?,
        class_room_id = ?,
        class_trainer_user_id = ?,
        class_date = ?,
        class_time = ?
      WHERE
        class_id = ?
    `,
    [
      activity.activity_id,
      room.room_id,
      trainer.user_id,
      gymClass.class_date,
      gymClass.class_time,
      gymClass.class_id,
    ]
  );

  return {
    class_activity_id: activity.activity_id,
    class_room_id: room.room_id,
    class_trainer_user_id: trainer.user_id,
    class_date: gymClass.class_date,
    class_time: gymClass.class_time,
  };
}

// Get all classes
export async function getAllClasses() {
  const [allClassResults] = await db.query("SELECT * FROM classes");
  return await allClassResults.map((classResult) =>
    Class(
      classResult.class_id,
      classResult.class_activity_id,
      classResult.class_room_id,
      classResult.class_trainer_user_id,
      new Date(classResult.class_date).toLocaleDateString(),
      classResult.class_time
    )
  );
}

// Get all classes by filter
export async function getAllClassesByFilter(classFilter) {
  const [allClassResults] = await db.query(
    `
SELECT * FROM classes
INNER JOIN activities ON classes.class_activity_id = activities.activity_id
INNER JOIN rooms ON classes.class_room_id = rooms.room_id
INNER JOIN users ON classes.class_trainer_user_id = users.user_id
WHERE 
activities.activity_name = ? 
AND rooms.room_location = ?
AND users.user_first_name = ?
AND classes.class_date = ?
`,
    [...Object.values(classFilter)]
  );
  return await allClassResults.map((classResult) =>
    Class(
      classResult.class_id,
      classResult.class_activity_id,
      classResult.class_room_id,
      classResult.class_trainer_user_id,
      classResult.class_date,
      classResult.class_time
    )
  );
}

// Get all classes with details
export async function getAllClassesWithDetails() {
  const [allClassResults] = await db.query(
    `
SELECT class_id, activity_name, room_number, user_first_name, class_date, class_time 
FROM classes 
INNER JOIN activities ON classes.class_activity_id = activities.activity_id 
INNER JOIN rooms ON classes.class_room_id = rooms.room_id 
INNER JOIN users ON classes.class_trainer_user_id = users.user_id 
ORDER BY class_date DESC
`
  );

  return allClassResults.map((classResult) =>
    Class(
      classResult.class_id,
      classResult.activity_name,
      classResult.room_number,
      classResult.user_first_name,
      new Date(classResult.class_date).toLocaleDateString(),
      classResult.class_time.substring(0, 5)
    )
  );
}

// Get class by id with details
export async function getClassByIdWithDetails(id) {
  const [classResults] = await db.query(
    `
SELECT class_id, activity_name, room_number, user_first_name, class_date, class_time
FROM classes
INNER JOIN activities ON classes.class_activity_id = activities.activity_id
INNER JOIN rooms ON classes.class_room_id = rooms.room_id
INNER JOIN users ON classes.class_trainer_user_id = users.user_id
WHERE class_id = ?
`,
    [id]
  );
  if (classResults.length > 0) {
    const classResult = classResults[0];
    return Promise.resolve(
      Class(
        classResult.class_id,
        classResult.activity_name,
        classResult.room_number,
        classResult.user_first_name,
        new Date(classResult.class_date).toLocaleDateString(),
        classResult.class_time.substring(0, 5)
      )
    );
  }
}

// Get a class by id
export async function getClassById(id) {
  const [classResults] = await db.query(
    `
    SELECT * FROM classes
    WHERE class_id = ?
    `,
    [id]
  );
  if (classResults.length > 0) {
    const classResult = classResults[0];
    return Promise.resolve(
      Class(
        classResult.class_id,
        classResult.class_activity_id,
        classResult.class_room_id,
        classResult.class_trainer_user_id,
        classResult.class_date,
        classResult.class_time
      )
    );
  } else {
    return Promise.reject("No class found");
  }
}

// Update a class by id
export async function updateClassById(id, classData) {
  return db
    .query(
      `
        UPDATE classes
        SET class_activity_id = ?, class_room_id = ?,  class_trainer_user_id = ?, class_date = ?, class_time = ?
        WHERE class_id = ?
    `,
      [
        classData.class_activity_id,
        classData.class_room_id,
        classData.class_trainer_user_id,
        classData.class_date,
        classData.class_time,
        id,
      ]
    )
    .then(() => {
      return { ...classData };
    });
}

// Delete a class by id
export function deleteClassById(id) {
  return db.query(
    `
        DELETE FROM classes
        WHERE class_id = ?
    `,
    [id]
  );
}
