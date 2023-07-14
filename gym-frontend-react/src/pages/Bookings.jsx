import { useState } from "react";
import Nav from "../components/Nav";
import { FilterForm } from "../components/FilterForm";
import BookingCRUD from "../components/BookingCRUD";
import { BookedClasses } from "../components/BookedClasses";
import { useAuthentication } from "../hooks/authentication";

export default function Bookings() {
  const [user] = useAuthentication();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  return (
    <div
      className={`bg-[url('./assets/background-corners.svg')] bg-center bg-cover ${
        user && user.user_role === "member" ? "h-screen" : ""
      }`}
    >
      <>
        <Nav refreshTrigger={refreshTrigger} />

        <div className="container p-2 mx-auto fade-in mt-4">
          {user &&
          (user.user_role === "admin" || user.user_role === "trainer") ? (
            <BookingCRUD />
          ) : (
            <></>
          )}
          {user && user.user_role === "member" ? (
            <>
              <div className="rounded border-0 border-black w-fit mb-1 mx-auto"></div>

              <div className="w-fit mx-auto drop-shadow-2xl filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));">
                <h2 className="text-center text-2xl font-semibold text-gray-700">
                  Book a Class
                </h2>

                <FilterForm
                  setRefreshTrigger={setRefreshTrigger}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </>
    </div>
  );
}
