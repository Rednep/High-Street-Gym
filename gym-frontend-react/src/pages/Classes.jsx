import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllActivities } from "../api/activities.js";
import Nav from "../components/Nav.jsx";
import BookNowButtonClasses from "../components/BookNowButtonClasses.jsx";
import Spinner from "../components/Spinner.jsx";

function wrapText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export default function ExploreClasses() {
  const navigate = useNavigate();

  // Load activities list
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getAllActivities(200).then(async (activities) => {
      // fetch activity details
      const activityDetails = await Promise.all(
        activities.map(async (activity) => {
          return Promise.resolve({
            id: activity.activity_id,
            name: activity.activity_name,
            description: activity.activity_description,
            duration: activity.activity_duration,
            image: activity.activity_image,
          });
        })
      );

      setActivities(activityDetails);
    });
  }, []);

  return (
    <div className="bg-[url('./assets/backgroundImage-large.svg')] bg-center bg-contain">
      <>
        <Nav />
        <div className="pt-20 fade-in pb-20">
          <div className="activity-list grid grid-cols-1 gap-y-5 mx-[10vw]">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`activity-item card bg-base-100 shadow-xl w-[80%] mx-auto xl:mx-0 transform ${
                  index % 2 !== 0 ? "xl:mr-[10%]" : "xl:ml-[10%]"
                } ${
                  index % 2 !== 0
                    ? "xl:flex xl:flex-row-reverse"
                    : "xl:flex xl:flex-row"
                }`}
              >
                <figure>
                  <img
                    src={activity.image}
                    alt="activity image"
                    className={`xl:h-fit rounded-lg p-4`}
                  />
                </figure>
                <div className="card-body w-full">
                  <h2 className="card-title mx-auto font-bold text-xl">
                    {activity.name}
                  </h2>
                  <p className="text-sm md:text-md mx-auto font-semibold leading-6 xl:mt-6 2xl:mt-8 2xl:mx-16">
                    {wrapText(activity.description, 1000)}
                  </p>

                  <div
                    className={`card-actions flex items-center justify-center ${
                      index % 2 !== 0
                        ? "flex-row-reverse md:justify-between"
                        : ""
                    }`}
                  >
                    {index % 2 === 0 ? (
                      <>
                        <p
                          className={`mt-50px self-end max-w-fit font-bold xs:max-w-full`}
                        >
                          Duration: {activity.duration}
                        </p>
                        <div className="flex justify-center">
                          <BookNowButtonClasses />
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          className={`mt-50px max-w-fit self-end font-bold xxs:mx-auto md:mx-0`}
                        >
                          Duration: {activity.duration}
                        </p>
                        <div className="flex justify-center">
                          <BookNowButtonClasses />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    </div>
  );
}
