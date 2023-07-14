import { Router } from "express";
import { validate } from "../middleware/validator.js";
import auth from "../middleware/auth.js";
import { Blog } from "../models/blog-object.js";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  getAllBlogPostsByUserId,
  updateBlogPost,
  deleteBlogPost,
} from "../models/blog.js";

const blogController = Router();

// Create a blog post
const createBlogPostSchema = {
  type: "object",
  required: ["post_title", "post_content", "user_id"],
  properties: {
    post_title: { type: "string" },
    post_content: { type: "string" },
    user_id: { type: "string" },
  },
};

blogController.post(
  "/create",
  validate({ body: createBlogPostSchema }),
  async (req, res) => {
    // #swagger.summary = 'Create a blog post'
    /* #swagger.requestBody = {
            description: "Creates a user",
            content: {
                'application/json': {
                    schema: {
                        post_title: 'string',
                        post_content: 'string',
                        post_user_id: 'string',
                    },
                    example: {
                        post_title: 'Blog Post Title',
                        post_content: 'Blog Post Content',
                        post_user_id: '1',
                    }
                }
            }
        } */
    const blogData = req.body;
    console.log(blogData);

    createBlogPost(blogData)
      .then((blogPost) => {
        res.status(200).json({
          status: 200,
          message: "Blog post created successfully",
          data: blogPost,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to create blog post",
        });
      });
  }
);

// Get all blog posts
blogController.get("/blog", async (req, res) => {
  // #swagger.summary = 'Get all blog posts'
  /* #swagger.description = 'Endpoint to get all blog posts.' */
  getAllBlogPosts()
    .then((blogPosts) => {
      res.status(200).json({
        status: 200,
        message: "Blog posts retrieved successfully",
        data: blogPosts,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve blog posts",
      });
    });
});

//Get a blog post by it's id
const getBlogPostByIdSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
};

// Get a blog post by it's id
blogController.get(
  "/blog/:id",
  validate({ params: getBlogPostByIdSchema }),
  async (req, res) => {
    // #swagger.summary = 'Get a blog post by its id'
    /* #swagger.description = 'Endpoint to get a blog post by it's id.' */
    const blogID = req.params.id;

    getBlogPostById(blogID)
      .then((blogPost) => {
        res.status(200).json({
          status: 200,
          message: "Blog post retrieved successfully",
          data: blogPost,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to retrieve blog post",
        });
      });
  }
);

// Get all blog posts by user id
const getAllBlogPostsByUserIdSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
};

blogController.get(
  "/blogs/:id",
  validate({ params: getAllBlogPostsByUserIdSchema }),
  async (req, res) => {
    // #swagger.summary = 'Get all blog posts by user id'
    /* #swagger.description = 'Endpoint to get all blog posts by user id.' */
    const userID = req.params.id;

    getAllBlogPostsByUserId(userID)
      .then((blogPosts) => {
        if (!blogPosts.post_user_id) {
          res.status(404).json({
            status: 404,
            message: "User doesn't exist",
          });
        } else {
          res.status(200).json({
            status: 200,
            message: "Blog posts retrieved successfully",
            data: blogPosts,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to retrieve blog posts",
        });
      });
  }
);

// Update a blog post
const updateBlogPostSchema = {
  type: "object",
  required: ["post_id", "post_user_id"],
  properties: {
    post_id: { type: "string" },
    post_title: { type: "string" },
    post_content: { type: "string" },
    post_user_id: { type: "string" },
  },
};

blogController.patch(
  "/update",
  validate({ body: updateBlogPostSchema }),
  async (req, res) => {
    // #swagger.summary = 'Update a blog post'
    /* #swagger.requestBody = {
            description: "Updates a blog post by id",
            content: {
                'application/json': {
                    schema: {
                        post_id: 'string',
                        post_title: 'string',
                        post_content: 'string',
                        post_user_id: 'string',
                    },
                    example: {
                        post_id: '1',
                        post_title: 'Blog Post Title',
                        post_content: 'Blog Post Content',
                        post_user_id: '1',
                    }
                }
            }
        } */
    const blogData = req.body;

    updateBlogPost(blogData)
      .then((blogPost) => {
        res.status(200).json({
          status: 200,
          message: "Blog post updated successfully",
          data: blogPost,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to update blog post",
        });
      });
  }
);

// Delete a blog post
const deleteBlogPostSchema = {
  type: "object",
  required: ["postID"],
  properties: {
    postID: { type: "string" },
  },
};

blogController.delete(
  "/delete/:postID",
  [auth(["admin"]), validate({ params: deleteBlogPostSchema })],
  async (req, res) => {
    // #swagger.summary = 'Delete a blog post by id'
    /* #swagger.description = 'Endpoint to delete a blog post by its id.' */
    const postID = req.params.postID;

    deleteBlogPost(postID)
      .then(() => {
        res.status(200).json({
          status: 200,
          message: "Blog post deleted successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to delete blog post",
        });
      });
  }
);

export default blogController;
