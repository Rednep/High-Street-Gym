import { useEffect, useState } from "react";
import { getAllClassesWithDetails } from "../api/classes";
import { createBooking, isClassBookedByUser } from "../api/bookings";
import { deleteClassById } from "../api/classes";
import { useAuthentication } from "../hooks/authentication";
import BookNowButton from "./BookNowButton";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function FilterForm({ setRefreshTrigger, refreshTrigger }) {
  const [user, login, logout] = useAuthentication();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);

  useEffect(() => {
    getAllClassesWithDetails().then(async (classes) => {
      const futureClasses = classes.filter((classItem) => {
        const [day, month, year] = classItem.class_date.split("/");
        const classDateTime = new Date(
          `${year}-${month}-${day}T${classItem.class_time}`
        );
        return classDateTime >= new Date();
      });
      for (let classItem of futureClasses) {
        classItem.isBooked = await isClassBookedByUser(
          user.user_id,
          classItem.class_id
        );
      }
      setClasses(futureClasses);
      setFilteredClasses(futureClasses);
    });
  }, [refreshTrigger]);

  useEffect(() => {
    let filtered = classes;

    if (selectedDate) {
      const formattedSelectedDate = formatDate(selectedDate);
      filtered = filtered.filter(
        (classItem) => classItem.class_date === formattedSelectedDate
      );
    }

    if (selectedActivity) {
      filtered = filtered.filter(
        (classItem) => classItem.class_activity_id === selectedActivity
      );
    }

    setFilteredClasses(filtered);
  }, [selectedDate, selectedActivity, classes]);

  async function handleBooking(class_id) {
    const currentDateTime = new Date().toISOString();

    const bookingData = {
      booking_user_id: user.user_id,
      booking_class_id: class_id.toString(),
      booking_datetime: currentDateTime,
    };
    createBooking(bookingData).then((booking) => {
      setRefreshTrigger((prevState) => !prevState);
    });
  }

  async function handleDeleteClass(class_id) {
    await deleteClassById(class_id);
    setRefreshTrigger((prevState) => !prevState);
  }

  const activityOptions = [
    ...new Set(filteredClasses.map((classItem) => classItem.class_activity_id)),
  ];

  return (
    <div className="fadeIn">
      <h2 className="text-gray-800 font-bold text-lg ml-4">Classes</h2>
      <div className="grid grid-cols-2 gap-4 p-4 pt-0">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-800 font-bold text-md">
              Date
            </span>
          </label>
          <input
            type="date"
            className="input input-bordered font-semibold text-sm w-full rounded-md p-2 shadow-lg"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-800 font-bold text-md">
              Activity
            </span>
          </label>
          <select
            className="select select-bordered font-semibold text-sm w-full rounded-md p-2 shadow-lg"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
          >
            <option value="">All activities</option>
            {activityOptions.map((activity) => (
              <option key={activity} value={activity}>
                {activity}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="my-4"></div>
      <div className="container mx-auto p-4">
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="table-auto w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {(user && user.user_role == "admin") ||
                user.user_role == "trainer" ? (
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Class ID
                  </th>
                ) : (
                  <></>
                )}
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Trainer
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                {user && user.user_role == "member" ? <th></th> : <></>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map((classItem, index) => (
                <tr
                  key={classItem.class_id}
                  className={`hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {(user && user.user_role == "admin") ||
                  user.user_role == "trainer" ? (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {classItem.class_id}
                    </td>
                  ) : (
                    <></>
                  )}
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                    {classItem.class_activity_id}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                    {classItem.class_room_id}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                    {classItem.class_trainer_user_id}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                    {classItem.class_date}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                    {classItem.class_time}
                  </td>
                  {user && user.user_role === "member" ? (
                    <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-center items-center">
                        {classItem.isBooked ? (
                          <img
                            src="http://localhost:8080/uploads/booked-icon.png"
                            className="w-6 h-6 transition-all duration-300 fade-in"
                            alt="Booked Icon"
                          />
                        ) : (
                          <BookNowButton
                            onClick={() => handleBooking(classItem.class_id)}
                          />
                        )}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
