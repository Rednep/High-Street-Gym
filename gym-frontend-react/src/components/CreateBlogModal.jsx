import { useState } from "react";
import { createBlogPost } from "../api/blog";
import { useAuthentication } from "../hooks/authentication";

export function CreateBlogModal({ toggleModal, onPostCreated }) {
  const [formData, setFormData] = useState({
    post_title: "",
    post_content: "",
  });

  const [user] = useAuthentication();

  async function createBlog(e) {
    e.preventDefault();
    const blogData = { ...formData, user_id: user.user_id };
    await createBlogPost(blogData);
    onPostCreated();
    toggleModal();
  }

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full min-w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex w-full flex-shrink-0 items-center justify-center">
                  <h2 className="text-xl font-black">Blog Post</h2>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left"></div>
              </div>
              <form
                onSubmit={createBlog}
                className="mx-auto mt-8 mb-0 max-w-md space-y-4"
              >
                <div>
                  <label htmlFor="post_title" className="sr-only">
                    Blog title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Blog title"
                      className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                      value={formData.post_title}
                      onChange={(e) =>
                        setFormData((existing) => {
                          return { ...existing, post_title: e.target.value };
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="post_content" className="sr-only">
                    Blog Content
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Blog Content..."
                      className="w-full rounded-lg border-gray-200 h-48 p-4 pr-12 text-sm shadow-sm"
                      value={formData.post_content}
                      onChange={(e) =>
                        setFormData((existing) => {
                          return { ...existing, post_content: e.target.value };
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={createBlog}
                className="inline-flex w-full justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition duration-200 transform hover:scale-105 hover:shadow-md"
              >
                Post
              </button>
              <button
                onClick={toggleModal} // Call toggleModal when the "Cancel" button is clicked
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition duration-200 transform hover:scale-105 hover:shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
