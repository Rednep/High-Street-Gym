import { useState } from "react";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import { FilterFormClass } from "../components/FilterFormClass";
import { CreateClassForm } from "../components/CreateClassForm";
import { useAuthentication } from "../hooks/authentication";

export default function CreateClass() {
  const [user] = useAuthentication();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [selectedClassID, setSelectedClassID] = useState(null);

  return (
    <div className="bg-[url('./assets/background-corners.svg')] bg-center bg-cover">
      <>
        <Nav />

        <div className="container p-2 mx-auto fade-in">
          {user &&
          (user.user_role === "admin" || user.user_role === "trainer") ? (
            <>
              <div className="card shadow-xl-top mb-8 mt-4 py-4 w-[95%] mx-auto fade-in">
                <div>
                  <h2 className="text-center text-gray-800 font-bold text-lg">
                    Class List
                  </h2>
                  <FilterFormClass
                    setRefreshTrigger={setRefreshTrigger}
                    refreshTrigger={refreshTrigger}
                    setSelectedClassID={setSelectedClassID}
                  />
                </div>
                <div className="mt-8">
                  <h2 className="text-center text-gray-800 font-bold text-md">
                    Create a Class
                  </h2>
                  <CreateClassForm
                    onClassCreated={() =>
                      setRefreshTrigger((prevState) => !prevState)
                    }
                    selectedClassID={selectedClassID}
                  />
                </div>
              </div>
            </>
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
        </div>
      </>
    </div>
  );
}
