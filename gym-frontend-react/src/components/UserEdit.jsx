import { useEffect, useState } from "react";
import { createUser, getUserByID, update } from "../api/user";
import CreateUserButton from "./CreateUserButton";
import SaveUserButton from "./SaveButton";

export default function UserEdit({ userID, onSave, allowEditRole }) {
  const [formData, setFormData] = useState({
    user_id: null,
    user_email: "",
    user_password: "",
    user_role: "",
    user_phone: "",
    user_first_name: "",
    user_last_name: "",
    user_address: "",
    authentication_key: null,
  });
  const [statusMessage, setStatusMessage] = useState("");

  const user = formData;

  useEffect(() => {
    if (userID) {
      getUserByID(userID).then((user) => {
        setFormData(user);
      });
    }
  }, [userID]);

  function saveUser(e) {
    e.preventDefault();
    setStatusMessage("Saving...");
    formData.user_phone = formData.user_phone.toString();
    update(formData).then((result) => {
      setStatusMessage(result.message);

      if (typeof onSave === "function") {
        onSave();
      }
    });
  }

  function create(e) {
    e.preventDefault();
    formData.user_phone = formData.user_phone.toString();
    createUser(user).then((result) => {
      if (typeof onSave === "function") {
        onSave();
      }
    });
  }

  return (
    <div className="w-full">
      <form
        className="flex-grow p-4 mb-1 w-full"
        onSubmit={userID ? saveUser : create}
      >
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text text-gray-700 font-bold">
              First Name
            </span>
          </label>
          <input
            type="text"
            placeholder="Thomas"
            className="input input-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.user_first_name}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, user_first_name: e.target.value };
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text text-gray-700 font-bold">
              Last Name
            </span>
          </label>
          <input
            type="text"
            placeholder="Anderson"
            className="input input-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.user_last_name}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, user_last_name: e.target.value };
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text text-gray-700 font-bold">Phone</span>
          </label>
          <input
            type="tel"
            placeholder="1234567890"
            className="input input-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.user_phone}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, user_phone: e.target.value };
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text text-gray-700 font-bold">Address</span>
          </label>
          <input
            type="text"
            placeholder="123 Fake St"
            className="input input-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.user_address}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, user_address: e.target.value };
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text text-gray-700 font-bold">Role</span>
          </label>
          <select
            className="select select-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.user_role}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, user_role: e.target.value };
              })
            }
            disabled={!allowEditRole}
          >
            <option disabled selected>
              Pick one
            </option>
            <option value="admin">Admin</option>
            <option value="trainer">Trainer</option>
            <option value="member">Member</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text text-gray-700 font-bold">Email</span>
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            className="input input-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.user_email}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, user_email: e.target.value };
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label font-semibold">
            <span className="label-text text-gray-700 font-bold">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered w-full rounded-md p-2 shadow-lg"
            value={formData.user_password}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, user_password: e.target.value };
              })
            }
          />
        </div>
        <div className="my-2">
          {userID ? (
            <SaveUserButton type="submit" />
          ) : (
            <CreateUserButton type="submit" />
          )}
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}
