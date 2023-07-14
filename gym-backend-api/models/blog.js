import { db } from "../database/db.js";
import { Blog } from "./blog-object.js";

// Create a new blog post
export async function createBlogPost(blogData) {
  const currentDate = new Date().toISOString().slice(0, 10);
  const currentTime = new Date().toLocaleString("en-AU").slice(11, 19);

  const blogPost = {
    ...blogData,
    post_date: currentDate,
    post_time: currentTime,
  };

  return db
    .query(
      `
            INSERT INTO blog_posts 
            (post_date, 
            post_time, 
            post_title, 
            post_content, 
            post_user_id)
            VALUES (?, ?, ?, ?, ?)
        `,
      [
        blogPost.post_date,
        blogPost.post_time,
        blogPost.post_title,
        blogPost.post_content,
        blogPost.user_id,
      ]
    )
    .then(([result]) => {
      return { ...blogPost };
    });
}

// Get all blog posts
export async function getAllBlogPosts() {
  const [allBlogPostResults] = await db.query(`
  SELECT * FROM blog_posts
    INNER JOIN users ON blog_posts.post_user_id = users.user_id
  `);

  return await allBlogPostResults.map((blogPostResult) =>
    Blog(
      blogPostResult.post_id,
      new Date(blogPostResult.post_date).toLocaleDateString(),
      blogPostResult.post_time,
      blogPostResult.post_title,
      blogPostResult.post_content,
      blogPostResult.user_first_name + " " + blogPostResult.user_last_name
    )
  );
}

//Get a blog post by it's id
export async function getBlogPostById(blogID) {
  const [blogPostResult] = await db.query(
    `
  SELECT * FROM blog_posts
    INNER JOIN users ON blog_posts.post_user_id = users.user_id
    WHERE post_id = ?
    `,
    [blogID]
  );

  return await blogPostResult.map((blogPostResult) =>
    Blog(
      blogPostResult.post_id,
      new Date(blogPostResult.post_date).toLocaleDateString(),
      blogPostResult.post_time,
      blogPostResult.post_title,
      blogPostResult.post_content,
      blogPostResult.user_first_name + " " + blogPostResult.user_last_name
    )
  );
}

// Get all blog posts by user id
export async function getAllBlogPostsByUserId(userID) {
  const [allBlogPostResults] = await db.query(
    "SELECT * FROM blog_posts WHERE post_user_id = ?",
    [userID]
  );

  return await allBlogPostResults.map((blogPostResult) =>
    Blog(
      blogPostResult.post_id,
      blogPostResult.post_date,
      blogPostResult.post_time,
      blogPostResult.post_title,
      blogPostResult.post_content,
      blogPostResult.post_user_id
    )
  );
}

// Update a blog post
export async function updateBlogPost(blogData) {
  return db
    .query(
      `
            UPDATE blog_posts SET 
            post_title = ?, 
            post_content = ?, 
            post_user_id = ?
            WHERE post_id = ?
            `,
      [
        blogData.post_title,
        blogData.post_content,
        blogData.post_user_id,
        blogData.post_id,
      ]
    )
    .then(([result]) => {
      return { ...blogData };
    });
}

// Delete a blog post
export async function deleteBlogPost(postID) {
  return db
    .query(
      `
            DELETE FROM blog_posts WHERE post_id = ?
            `,
      [postID]
    )
    .then(([result]) => {
      return { ...postID };
    });
}
