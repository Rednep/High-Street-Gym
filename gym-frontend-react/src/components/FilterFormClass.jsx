import { useEffect, useState } from "react";
import { getAllClassesWithDetails } from "../api/classes";
import { deleteClassById } from "../api/classes";
import { useAuthentication } from "../hooks/authentication";
import DeleteButton from "../components/DeleteButton";
import EditButton from "./EditButton";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function FilterFormClass({
  setRefreshTrigger,
  refreshTrigger,
  setSelectedClassID,
}) {
  const [user, login, logout] = useAuthentication();
  const [selectedDate, setSelectedDate] = useState("");

  // Load classes
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);

  useEffect(() => {
    getAllClassesWithDetails().then((classes) => {
      setClasses(classes);
      setFilteredClasses(classes);
    });
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = formatDate(selectedDate);
      setFilteredClasses(
        classes.filter((item) => item.class_date === formattedSelectedDate)
      );
    } else {
      setFilteredClasses(classes);
    }
  }, [selectedDate, classes]);

  async function handleDeleteClass(class_id) {
    await deleteClassById(class_id);
    setRefreshTrigger((prevState) => !prevState);
  }

  return (
    <div>
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-800 font-bold text-sm ml-[1%]">
            Date of class
          </span>
        </label>
        <input
          type="date"
          className="input input-bordered w-[98%] mx-auto rounded-md p-2 "
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
        />
      </div>
      <div className="my-4"></div>
      <div className="container mx-auto w-[98%]">
        <div className="overflow-x-auto rounded-lg ">
          <table className="table-auto w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {(user && user.user_role == "admin") ||
                user.user_role == "trainer" ? (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Class ID
                  </th>
                ) : (
                  <></>
                )}
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Activity Name
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Trainer Name
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Edit
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Delete
                </th>
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
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600 ">
                    <div className="flex justify-center">
                      <EditButton
                        onClick={() => setSelectedClassID(classItem.class_id)}
                      />
                      {/* <button
                        className="btn btn-sm  items-center transition duration-200 transform hover:scale-105 hover:shadow-md"
                        onClick={() => setSelectedClassID(classItem.class_id)}
                      >
                        Edit
                      </button> */}
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex justify-center">
                      <DeleteButton
                        onClick={() => handleDeleteClass(classItem.class_id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
