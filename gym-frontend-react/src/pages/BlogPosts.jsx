import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogPosts } from "../api/blog.js";
import { deleteBlogPost } from "../api/blog.js";
import { CreateBlogModal } from "../components/CreateBlogModal.jsx";
import ReadPostButtonBlog from "../components/ReadPostButtonBlog.jsx";
import CreateBlogPostButton from "../components/CreateBlogPostButton.jsx";
import { useAuthentication } from "../hooks/authentication";
import Nav from "../components/Nav.jsx";
import DeleteButton from "../components/DeleteButton.jsx";
import Spinner from "../components/Spinner.jsx";

export default function BlogPosts() {
  const navigate = useNavigate();
  const [user] = useAuthentication();

  // Load blog posts
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Function to toggle the modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const refreshPosts = async () => {
    const response = await getAllBlogPosts(100);
    if (!response || !Array.isArray(response.data)) {
      return;
    }

    const posts = response.data;

    const blogDetails = await Promise.all(
      posts.map(async (post) => {
        return Promise.resolve({
          id: post.post_id,
          date: post.post_date,
          time: post.post_time,
          title: post.post_title,
          content: post.post_content,
          user: post.post_user_id,
        });
      })
    );

    setPosts(blogDetails);
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const handleDeletePost = (postId) => {
    deleteBlogPost(postId)
      .then(() => {
        refreshPosts();
      })
      .catch((error) => {});
  };

  return (
    <div className="bg-[url('./assets/background-corners.svg')] bg-center bg-cover h-screen">
      <>
        <Nav />
        <div className="card shadow-xl-top py-4 grid fade-in w-fit mt-10 mx-auto fadeIn">
          <h2 className="font-bold text-xl mb-8 text-center">Blog</h2>

          <div className="overflow-x-auto rounded-lg ">
            {posts.length == 0 ? (
              <Spinner />
            ) : (
              <div className="table-wrapper w-fit shadow-lg">
                <table className="table-auto w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th></th>
                      {user && user.user_role === "admin" ? (
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Delete
                        </th>
                      ) : (
                        <></>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post, index) => (
                      <tr
                        key={post.id}
                        className={`hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                          {post.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                          {post.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">{`${post.content.slice(
                          0,
                          50
                        )} ...`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-600">
                          {post.user}
                        </td>
                        <td>
                          <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <ReadPostButtonBlog
                              onClick={() => navigate(`/blog/${post.id}`)}
                            />
                          </div>
                        </td>
                        {user && user.user_role === "admin" ? (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-center">
                              <DeleteButton
                                onClick={() => handleDeletePost(post.id)}
                              />
                            </div>
                          </td>
                        ) : (
                          <></>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <CreateBlogPostButton
            onClick={toggleModal}
            className="mt-1 mb-4 py-2 px-4"
          />

          {showModal && (
            <CreateBlogModal
              toggleModal={toggleModal}
              onPostCreated={refreshPosts}
            />
          )}
        </div>
      </>
    </div>
  );
}
