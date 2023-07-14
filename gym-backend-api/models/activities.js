import { db } from "../database/db.js";
import { Activity } from "../models/activity-object.js";

// Create a new activity
export async function createActivity(activityData) {
  return db
    .query(
      `
    INSERT INTO activities (activity_name, activity_description, activity_duration) 
    VALUES (?, ?, ?)
`,
      [
        activityData.activity_name,
        activityData.activity_description,
        activityData.activity_duration,
      ]
    )
    .then(([result]) => {
      return { ...activityData };
    });
}

// Get all activities
export async function getAllActivities() {
  const [allActivityResults] = await db.query("SELECT * FROM activities");
  return await allActivityResults.map((activityResult) =>
    Activity(
      activityResult.activity_id,
      activityResult.activity_name,
      activityResult.activity_description,
      activityResult.activity_duration,
      activityResult.activity_image
    )
  );
}

// Get an activity by it's name
export async function getActivityByName(activityName) {
  const [activityResults] = await db.query(
    "SELECT * FROM activities WHERE activity_name = ?",
    [activityName]
  );
  return await activityResults.map((activityResult) =>
    Activity(
      activityResult.activity_id,
      activityResult.activity_name,
      activityResult.activity_description,
      activityResult.activity_duration
    )
  );
}

// Get an activity by it's ID
export async function getActivityByID(activityID) {
  return db
    .query("SELECT * FROM activities WHERE activity_id = ?", [activityID])
    .then(([result]) => {
      if (result.length === 0) {
        return null;
      }
      return Activity(
        result[0].activity_id,
        result[0].activity_name,
        result[0].activity_description,
        result[0].activity_duration
      );
    });
}

// Update an activity by it's ID
export async function updateActivityByID(activityData) {
  return db.query(
    `
    UPDATE activities
    SET activity_name = ?, activity_description = ?, activity_duration = ?
    WHERE activity_id = ?
`,
    [
      activityData.activity_name,
      activityData.activity_description,
      activityData.activity_duration,
      activityData.activity_id,
    ]
  );
}

// Delete an activity by it's ID
export async function deleteActivityByID(activityID) {
  return db.query("DELETE FROM activities WHERE activity_id = ?", [activityID]);
}
