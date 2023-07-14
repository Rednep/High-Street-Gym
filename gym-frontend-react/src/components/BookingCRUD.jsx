import { useEffect, useState } from "react";
import { getAllBookingsWithDetails } from "../api/bookings";
import { deleteBookingById } from "../api/bookings";
import { getAllUsers } from "../api/user";
import { useAuthentication } from "../hooks/authentication";
import { FilterForm } from "./FilterForm";
import BookingCreate from "./BookingCreate";
import DeleteButton from "./DeleteButton";
import Spinner from "../components/Spinner";
import PaginationPreviousButton from "./PaginationPreviousButton";
import PaginationPageButton from "./PaginationPageButton";
import PaginationNextButton from "./PaginationNextButton";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function BookingCRUD() {
  const [user] = useAuthentication();
  const [refreshTrigger, setRefreshTrigger] = useState();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Load booking list
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    getAllBookingsWithDetails(pageNumber, pageSize).then(
      ({ bookings, total }) => {
        setBookings(bookings);
        setFilteredBookings(bookings);
        setTotal(total);
      }
    );
  }, [refreshTrigger, user, pageNumber, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  const pagination = (
    <div className="join">
      <PaginationPreviousButton
        className="join-item btn"
        disabled={pageNumber === 1}
        onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
      />
      {Array.from({ length: totalPages }, (_, i) => (
        <PaginationPageButton
          className={`join-item btn ${
            pageNumber === i + 1 ? "btn-active" : ""
          }`}
          onClick={() => setPageNumber(i + 1)}
          pageIndex={i + 1}
        />
      ))}
      <PaginationNextButton
        className="join-item btn"
        disabled={pageNumber === totalPages}
        onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
      />
    </div>
  );

  // Load user list
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users);
    });
  }, [refreshTrigger]);

  useEffect(() => {
    let filtered = bookings;

    if (selectedDate) {
      const formattedSelectedDate = formatDate(selectedDate);
      filtered = filtered.filter(
        (booking) => booking.class_date === formattedSelectedDate
      );
    }

    if (selectedActivity) {
      filtered = filtered.filter(
        (booking) => booking.activity_name === selectedActivity
      );
    }

    setFilteredBookings(filtered);
  }, [selectedDate, selectedActivity, bookings]);

  const handleDeleteBooking = (bookingID) => {
    deleteBookingById(bookingID)
      .then(() => {
        setRefreshTrigger({});
      })
      .catch((error) => {});
  };

  const activityOptions = [
    ...new Set(filteredBookings.map((booking) => booking.activity_name)),
  ];

  return (
    <>
      <div className="container mx-auto grid grid-cols-3 gap-2 mt-10">
        <div className="rounded border-2 border-primary p-2 pb-4 col-span-2 bg-white">
          <h2 className="text-gray-800 font-bold text-lg">Bookings</h2>
          <div className="grid grid-cols-2 grid-column-start my-4">
            <div className="flex flex-col">
              <label className="label-text text-gray-800 font-bold">Date</label>
              <input
                type="date"
                className="input input-bordered font-semibold text-sm w-full rounded-md p-2 shadow-lg"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col ml-2">
              <label className="label-text text-gray-800 font-bold">
                Activity
              </label>
              <select
                className="select select-bordered font-semibold text-sm w-full rounded-md p-2 shadow-lg"
                value={selectedActivity}
                onChange={(e) => {
                  setSelectedActivity(e.target.value);
                }}
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
          <div className="overflow-auto w-full rounded-lg shadow-lg mt-4">
            {bookings == null ? (
              <Spinner />
            ) : (
              <table className="table-auto w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Delete
                  </th>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking, index) => (
                    <tr
                      key={booking.booking_id}
                      className={`hover:bg-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {booking.booking_id}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                        {booking.user_email}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                        {booking.class_date}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                        {booking.class_time}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                        {booking.activity_name}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                        {booking.trainer}
                      </td>
                      <td>
                        <DeleteButton
                          onClick={() =>
                            handleDeleteBooking(booking.booking_id)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-center">{pagination}</div>
        </div>
        <div className="rounded border-2 border-primary p-2 col-span-1 bg-white">
          <BookingCreate onBookingCreated={() => setRefreshTrigger({})} />
        </div>
        <div className="rounded border-2 border-primary p-2 col-span-2 bg-white">
          <FilterForm
            onAdded={() => setRefreshTrigger({})}
            refreshTrigger={refreshTrigger}
            setRefreshTrigger={setRefreshTrigger}
          />
        </div>
        <div className="container mx-auto gap-2 w-full">
          <div className="rounded border-2 border-primary p-4 bg-white">
            <h2 className="text-gray-800 font-bold text-lg">Users</h2>
            <div className="overflow-auto w-full rounded-lg shadow-lg mt-4">
              {users == null ? (
                <Spinner />
              ) : (
                <table className="table-auto w-full overflow-scroll">
                  <thead className="bg-gray-100">
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr
                        key={user.user_id}
                        className={`hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {user.user_id}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                          {user.user_first_name} {user.user_last_name}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                          {user.user_role}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                          {user.user_email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
