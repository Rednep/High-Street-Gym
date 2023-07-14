import { useEffect, useState } from "react";
import { getAllTrainers } from "../api/user";
import { getAllActivities } from "../api/activities";
import { getAllRooms } from "../api/rooms";
import { getClassByIdWithDetails } from "../api/classes";
import { createClassWithDetails } from "../api/classes";
import { updateClassWithDetails } from "../api/classes";
import CreateClassButton from "../components/CreateClassButton";
import UpdateClassButton from "./UpdateClassButon";

export function CreateClassForm({
  onClassCreated,
  refreshTrigger,
  selectedClassID,
}) {
  const [formData, setFormData] = useState({
    activity_name: "",
    room_number: "",
    trainer: "",
    class_date: "",
    class_time: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const [activities, setActivities] = useState([]);
  useEffect(() => {
    getAllActivities().then((activities) => {
      setActivities(activities);
    });
  }, []);

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    getAllRooms().then((rooms) => {
      setRooms(rooms);
    });
  }, []);

  const [trainers, setTrainers] = useState([]);
  useEffect(() => {
    getAllTrainers().then((trainers) => {
      setTrainers(trainers);
    });
  }, []);

  function convertDateFormat(dateString) {
    const dateParts = dateString.split("/");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  useEffect(() => {
    if (selectedClassID) {
      getClassByIdWithDetails(selectedClassID).then((classDetails) => {
        if (classDetails) {
          const formattedDate = convertDateFormat(classDetails.class_date);
          setFormData({
            activity_name: classDetails.class_activity_id,
            room_number: classDetails.class_room_id,
            trainer: classDetails.class_trainer_user_id,
            class_date: formattedDate,
            class_time: classDetails.class_time,
          });
        }
      });
    }
  }, [selectedClassID, refreshTrigger]);

  function handleCreateClass(e) {
    e.preventDefault();
    // setStatusMessage("Creating class...");

    const gymClass = {
      class_activity_name: formData.activity_name,
      class_room_number: formData.room_number,
      class_trainer_first_name: formData.trainer,
      class_date: formData.class_date,
      class_time: formData.class_time,
    };

    createClassWithDetails(gymClass).then((result) => {
      onClassCreated();
      // setStatusMessage("Class created...");
    });
  }

  function handleUpdateClass(e) {
    e.preventDefault();
    // setStatusMessage("Creating class...");

    const gymClass = {
      class_id: selectedClassID,
      class_activity_name: formData.activity_name,
      class_room_number: formData.room_number,
      class_trainer_first_name: formData.trainer,
      class_date: formData.class_date,
      class_time: formData.class_time,
    };

    updateClassWithDetails(gymClass).then((result) => {
      onClassCreated();
      // setStatusMessage("Class created...");
    });
  }

  return (
    <div className="w-full flex justify-center">
      <form className="flex-grow max-w-2xl" onSubmit={handleCreateClass}>
        <div className="form-control">
          <label className="label text-gray-600 font-semibold">
            <span className="label-text">Activity Name</span>
          </label>
          <select
            className="select select-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.activity_name}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, activity_name: e.target.value };
              })
            }
          >
            <option value="">Pick one</option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.activity_name}>
                {activity.activity_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label text-gray-600 font-semibold">
            <span className="label-text">Room Number</span>
          </label>
          <select
            className="select select-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.room_number}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, room_number: e.target.value };
              })
            }
          >
            <option value="">Pick one</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.room_number}>
                {room.room_number}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label text-gray-600 font-semibold">
            <span className="label-text">Trainer</span>
          </label>
          <select
            className="select select-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.trainer}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, trainer: e.target.value };
              })
            }
          >
            <option value="">Pick one</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.user_first_name}>
                {trainer.user_first_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label text-gray-600 font-semibold">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.class_date}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, class_date: e.target.value };
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label text-gray-600 font-semibold">
            <span className="label-text">Time</span>
          </label>
          <input
            type="time"
            className="input input-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.class_time}
            step="60"
            onChange={(e) => {
              const timeWithSeconds = e.target.value + ":00";
              setFormData((existing) => {
                return { ...existing, class_time: timeWithSeconds };
              });
            }}
          />
        </div>
        <div className="my-2">
          {selectedClassID ? (
            <UpdateClassButton onClick={handleUpdateClass} />
          ) : (
            <CreateClassButton onClick={handleCreateClass} />
          )}
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}
