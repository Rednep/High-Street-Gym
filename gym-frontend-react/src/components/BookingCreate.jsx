import { useEffect, useState } from "react";
import { getAllUsers } from "../api/user";
import { getAllClassesWithDetails } from "../api/classes";
import { createBooking } from "../api/bookings";
import CreateBookingButton from "./CreateBookingButton";

export default function BookingCreate({ onBookingCreated }) {
  const [formData, setFormData] = useState({
    user_id: "",
    class_id: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const [users, setUsers] = useState([]);
  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  const [classes, setClasses] = useState([]);
  useEffect(() => {
    getAllClassesWithDetails().then((classes) => {
      setClasses(classes);
    });
  }, []);

  function handleCreateBooking(e) {
    console.log("formData:", formData);
    e.preventDefault();
    setStatusMessage("Creating booking...");

    const bookingData = {
      booking_user_id: formData.user_id,
      booking_class_id: formData.class_id,
    };

    createBooking(bookingData).then((result) => {
      setStatusMessage(result.message);
      if (typeof onBookingCreated === "function") {
        onBookingCreated();
      }
    });
  }

  return (
    <div>
      <h2 className="text-gray-800 font-bold text-lg">Create Booking</h2>
      <form className="flex-grow m-4 max-w-2xl" onSubmit={handleCreateBooking}>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-800 font-bold">User</span>
          </label>
          <select
            className="select select-bordered font-semibold text-sm w-full rounded-md p-2 shadow-lg"
            value={formData.user_id}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, user_id: e.target.value };
              })
            }
          >
            <option selected>Pick one</option>
            {users.map((user) => (
              <option key={user.id} value={user.user_id}>
                {user.user_email} - {user.user_first_name} {user.user_last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-800 font-bold mt-3">
              Class
            </span>
          </label>
          <select
            className="select select-bordered font-semibold text-sm w-full rounded-md p-2 shadow-lg"
            value={formData.class_id}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, class_id: e.target.value };
              })
            }
          >
            <option selected>Pick one</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.class_id}>
                {classItem.class_activity_id} - {classItem.class_date} -{" "}
                {classItem.class_time}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <CreateBookingButton onClick={handleCreateBooking} />
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}
