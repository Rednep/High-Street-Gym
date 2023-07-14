import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";
import { getUserByID } from "../api/user";
import { getFutureBookingsNumber } from "../api/bookings";
import { useProfileImage } from "../contexts/ProfileImageContext";
import { useBookings } from "../contexts/BookingsContext";

export default function Nav({ refreshTrigger }) {
  const [user, login, logout] = useAuthentication();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { profileImage } = useProfileImage();
  const { futureBookings, updateFutureBookings } = useBookings();
  const { bookedClasses } = getFutureBookingsNumber(user ? user.user_id : null);

  // Define logout procedure
  function onLogoutClick(e) {
    logout();
    navigate("/");
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (user) {
      getFutureBookingsNumber(user.user_id).then((response) => {
        updateFutureBookings(response.bookings);
      });
    }
  }, [user, refreshTrigger]);

  return (
    <div className="bg-[#f5f5f5]">
      <div className="navbar bg-primary shadow-2xl">
        <div className="navbar-start">
          <div className="dropdown w-20">
            <label
              tabIndex={0}
              className="btn btn-circle btn-ghost avatar hover:bg-black w-16 h-16"
            >
              <div className="w-20 rounded-full">
                {user && profileImage && (
                  <img
                    src={`${profileImage}?timestamp=${new Date().getTime()}`}
                    alt="User Profile"
                  />
                )}
                {futureBookings > 0 && (
                  <span className="absolute top-0 right-0 px-1.5 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {futureBookings}
                  </span>
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                {futureBookings > 0 && (
                  <span className="absolute top-0 right-0 px-1.5 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {futureBookings}
                  </span>
                )}
              </li>
              <li>
                <a onClick={onLogoutClick}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-white text-2xl font-bold">
            High Street Gym
          </a>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <button
              onClick={toggleMenu}
              tabIndex={0}
              className="btn btn-ghost btn-circle btn-primary "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className={`menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 ${
                isOpen
                  ? "scale-y-100 translateY-0 opacity-100"
                  : "scale-y-0 translateY-full opacity-0"
              }`}
            >
              {user &&
                (user.user_role == "admin" || user.user_role == "trainer") && (
                  <>
                    <li>
                      <Link to="/users" onClick={() => setIsOpen(false)}>
                        Users
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/activityUpload"
                        onClick={() => setIsOpen(false)}
                      >
                        Upload Activities
                      </Link>
                    </li>
                    <li>
                      <Link to="/roomUpload" onClick={() => setIsOpen(false)}>
                        Upload Rooms
                      </Link>
                    </li>
                    <li>
                      <Link to="/createClass" onClick={() => setIsOpen(false)}>
                        Create Class
                      </Link>
                    </li>
                  </>
                )}
              <li>
                <Link to="/classes" onClick={() => setIsOpen(false)}>
                  Explore Classes
                </Link>
              </li>
              {user && user.user_role == "member" ? (
                <li>
                  <Link to="/bookings" onClick={() => setIsOpen(false)}>
                    Book a Class
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/bookings" onClick={() => setIsOpen(false)}>
                    Bookings
                  </Link>
                </li>
              )}
              <li>
                <Link to="/blogPosts" onClick={() => setIsOpen(false)}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
