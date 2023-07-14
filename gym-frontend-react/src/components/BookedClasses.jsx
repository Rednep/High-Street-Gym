import { useState, useEffect } from "react";
import { deleteBookingById } from "../api/bookings";
import { getAllBookingsByUserID } from "../api/bookings";
import { useBookings } from "../contexts/BookingsContext";
import CancelButton from "./CancelButton";

export function BookedClasses({ userID, setRefreshTrigger }) {
  const [bookings, setBookings] = useState([]);
  const { updateFutureBookings } = useBookings();
  useEffect(() => {
    if (userID)
      getAllBookingsByUserID(userID).then((response) => setBookings(response));
  }, [userID, setRefreshTrigger]);

  const handleDeleteBooking = (bookingID) => {
    deleteBookingById(bookingID).then(() => {
      getAllBookingsByUserID(userID).then((response) => {
        setBookings(response);
        updateFutureBookings();
      });
    });
  };

  return (
    <div className="container mx-auto">
      <div className="overflow-x-auto rounded-lg">
        <table className="table-auto w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Activity Name
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Room Location
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
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Cancel
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking, index) => {
              const [day, month, year] = booking.class_date.split("/");
              const bookingDateTime = new Date(
                `${year}-${month}-${day}T${booking.class_time}`
              );

              const now = new Date();
              const isPastClass = bookingDateTime < now;

              return (
                <tr
                  key={booking.booking_user_id}
                  className={`hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.activity_name}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.room_location}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.trainer}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.class_date}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.class_time}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex justify-center items-center">
                      <CancelButton
                        onClick={() => handleDeleteBooking(booking.booking_id)}
                        disabled={isPastClass}
                      >
                        Cancel
                      </CancelButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
