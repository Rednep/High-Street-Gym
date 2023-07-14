import { useEffect, useState } from "react";
import { getAllActivities } from "../api/activities";
import Nav from "../components/Nav";
import { XMLUpload } from "../components/XMLUpload";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";

function wrapText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export default function ActivityUpload() {
  const [user] = useAuthentication();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    getAllActivities().then((activities) => setActivities(activities));
  }, []);

  return (
    <div className="bg-[url('./assets/background-corners.svg')] bg-center bg-cover">
      <>
        <Nav />
        {user && (user.user_role == "admin" || user.user_role == "trainer") ? (
          <div className="container px-2 py-4 mx-auto sm:px-4 lg:px-8 fade-in">
            <div className="card shadow-xl-top p-4">
              <h2 className="text-center text-gray-800 font-bold text-lg mb-4">
                All Activities
              </h2>
              <div className="overflow-x-auto rounded-lg">
                <table className="table-auto w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity, index) => (
                      <tr
                        key={activity.id}
                        className={`hover:bg-gray-100 text-center ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {activity.activity_id}
                        </td>
                        <td className="flex contents-center w-fit mx-auto">
                          <img
                            src={activity.activity_image}
                            alt="activity image"
                            className="w-32"
                          />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                          {activity.activity_name}
                        </td>
                        <td className="description-cell px-2 py-4 text-sm text-gray-600 text-left">
                          {wrapText(activity.activity_description, 1000)}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                          {activity.activity_duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <XMLUpload
                onUploadSuccess={() => {
                  getAllActivities().then((activities) =>
                    setActivities(activities)
                  );
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="text-4xl">Not Authorised</h2>
              <span className="text-xl">
                Access role is not permitted to view this page.
              </span>
              <button className="btn btn-lg" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </>
        )}
      </>
    </div>
  );
}
