import { API_URL } from "./api.js";

export async function createBlogPost(blogData) {
  const response = await fetch(API_URL + "/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blogData),
  });

  const APIResponseObject = await response.json();
  console.log(APIResponseObject);

  return APIResponseObject;
}

export async function getAllBlogPosts() {
  // GET from the API /blog
  const response = await fetch(API_URL + "/blog", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function getBlogPostById(blogID) {
  // GET from the API /blog
  const response = await fetch(API_URL + "/blog/" + blogID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.data[0];
}

export async function getAllBlogPostsByUserId(userId) {
  // GET from the API /blog
  const response = await fetch(API_URL + "/blog/user/" + userId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function updateBlogPost(blogPost) {
  const response = await fetch(API_URL + "/blog", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blogPost),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}

export async function deleteBlogPost(postID) {
  const authenticationKey = localStorage.getItem("authentication_key");
  const response = await fetch(API_URL + "/delete/" + postID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: authenticationKey,
    },
  });

  const APIResponseObject = await response.json();

  console.log(APIResponseObject);

  return APIResponseObject;
}
