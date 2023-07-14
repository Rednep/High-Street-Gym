import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogPostById } from "../api/blog.js";
import Nav from "../components/Nav.jsx";
import BackButton from "../components/BackButton.jsx";
import Spinner from "../components/Spinner.jsx";

export default function FullBlogPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getBlogPostById(postId).then((post) => {
      setPost(post);
    });
  }, [postId]);

  return (
    <div className="bg-[url('./assets/background-corners.svg')] bg-center bg-cover h-screen">
      <>
        <Nav />
        <div className="container p-2 mt-10 mx-auto fade-in">
          <div className="card bg-base-100 shadow-xl w-fit">
            {post ? (
              <div className="card-body space-y-4">
                <h2 className="card-title font-bold text-xl">
                  {post.post_title}
                </h2>
                <p className="card-subtitle mb-2 font-semibold text-md">
                  User: {post.post_user_id}
                </p>
                <p className="card-text py-8">{post.post_content}</p>
                <div className="card-actions font-semibold text-md justify-end space-y-2">
                  <p>
                    Posted on {post.post_date} at {post.post_time}
                  </p>
                  <BackButton onClick={() => navigate("/blogPosts")} />
                </div>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </>
    </div>
  );
}
