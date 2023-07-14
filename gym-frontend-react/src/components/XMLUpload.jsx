import { useRef, useState } from "react";
import { API_URL } from "../api/api";
import UploadButton from "./UploadButton";

export function XMLUpload({ onUploadSuccess }) {
  const [statusMessage, setStatusMessage] = useState("");

  // useRef is the react way of getting an element reference like below:
  // const uploadInput = document.getElementById("file-input")
  const uploadInputRef = useRef(null);

  function uploadFile(e) {
    e.preventDefault();
    setStatusMessage("Not yet implemented");
    const authenticationKey = localStorage.getItem("authentication_key");

    // Files is an array because the user could select multiple files
    // we choose to upload only the first selected file in this case.
    const file = uploadInputRef.current.files[0];
    console.log(file);

    // Fetch expects multi-part form data to be provided
    // inside a FormData object.
    const formData = new FormData();
    formData.append("xml-file", file);

    if (file.name === "activity-upload.xml") {
      fetch(API_URL + "/activities/upload/xml", {
        method: "POST",
        headers: {
          Authorization: authenticationKey,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((APIResponse) => {
          setStatusMessage(APIResponse.message);
          // clear the selected file
          uploadInputRef.current.value = null;
          // Notify of successful upload
          if (typeof onUploadSuccess === "function") {
            onUploadSuccess();
          }
        })
        .catch((error) => {
          console.log(error);
          setStatusMessage("Upload failed - " + error);
        });
    } else {
      fetch(API_URL + "/rooms/upload/xml", {
        method: "POST",
        headers: {
          Authorization: authenticationKey,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((APIResponse) => {
          setStatusMessage(APIResponse.message);
          // clear the selected file
          uploadInputRef.current.value = null;
          // Notify of successful upload
          if (typeof onUploadSuccess === "function") {
            onUploadSuccess();
          }
        })
        .catch((error) => {
          console.log(error);
          setStatusMessage("Upload failed - " + error);
        });
    }
  }

  return (
    <div>
      <form className="flex-grow m-4 max-w-2xl" onSubmit={uploadFile}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">XML File Import</span>
          </label>
          <div className="flex gap-2">
            <input
              ref={uploadInputRef}
              type="file"
              className="file-input file-input-bordered file-input-blue-700"
            />
            <UploadButton onClick={uploadFile} />
          </div>
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}
