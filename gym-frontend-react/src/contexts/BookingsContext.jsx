import { createContext, useContext, useState, useEffect } from "react";
import { getFutureBookingsNumber } from "../api/bookings";
import { useAuthentication } from "../hooks/authentication";

const BookingsContext = createContext();

export const useBookings = () => {
  return useContext(BookingsContext);
};

export const BookingsProvider = ({ children }) => {
  const [user] = useAuthentication();
  const [futureBookings, setFutureBookings] = useState([]);

  // this function will be used to update futureBookings
  const updateFutureBookings = () => {
    getFutureBookingsNumber(user.user_id).then((response) => {
      setFutureBookings(response.bookings);
    });
  };

  // this effect will run initially and every time the user changes
  useEffect(() => {
    if (user) {
      updateFutureBookings();
    }
  }, [user]);

  return (
    <BookingsContext.Provider value={{ futureBookings, updateFutureBookings }}>
      {children}
    </BookingsContext.Provider>
  );
};
