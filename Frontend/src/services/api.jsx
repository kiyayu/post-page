import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Use the correct environment variable here
  headers: {
    "Content-Type": "application/json", // Ensure content type is set correctly
  },
});
 console.log("this is envarionment vairable",import.meta.env.VITE_API_URL)

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set multipart/form-data when actually sending form data
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});
//register
export const register = (formData) => api.post("/user/register", formData);  

//login
export const login = (formData) => api.post("/user/login", formData);

//request reset password
export const requestPasswordReset = (data) =>
  api.post("/user/request-password-reset", data);

// reset password
export const resetPassword = (token, password) =>
  api.post(`/user/reset-password/${token}`, { password });

//resend verfication 
export const resendVerificationEmail = (data) =>
  api.post("/user/resend-verification", data);

// verfiy email
export const verifyEmail = (token) => api.get(`/verify-email/${token}`);

// user profile
export const userProfile = () => api.get("/user/profile");
// updated profile
export const updateProfile = (data) => {
  return api.put("/user/update", data); // No need to redefine headers
};

// delete Account
export const deleteAccount = (password) => api.get("/delete/account", password)

// post categories
export const getCategories = () => api.get("/categories");

// post 
export const createPost = (formData) => api.post("/post", formData)

//get post
export const getPost = ({page, perPage, sortBy, order, category, search, title, popular, postId}) => 
  api.get("/post", {params: {page, perPage, sortBy, order, category, search, title, popular, postId}});

// get your post
export const getYourPost = (id) => api.get(`/user/posts/${id}`);

// get popular psot
export const getPopularPosts = () => api.get("/posts/popular")
// updated post
export const updatePost = (postId, formData ) => api.put(`/post/${postId}`, formData)

// delete post 
export const deletePost = (postId) => api.delete(`/post/${postId}`)

// get post byid
export const getPostByid = (postId) => api.get(`/post/${postId}`)

 

export const createComment = (postId, commentText) => {
  return api.post(
    `/comment/${postId}`,
    { commentText },
    {
      headers: {
        "Content-Type": "application/json", // Ensure JSON content type
      },
    }
  );     
};

// get comment 
export const getComment =  (postId, {page}) => api.get(`comment/${postId}`,{params:{page}} )

// update comment 
export const updateComment = (postId, commentId, commentUpdatedText) => api.put(`/post/${postId}/comment/${commentId}`, {commentUpdatedText})

// delete comment
export const deleteComment = (postId, commentId) => api.delete(`/post/${postId}/comment/${commentId}`)

export const replayComment = (postId, commentId, replyText) =>
  api.post(`/post/${postId}/comment/${commentId}/reply`, { replyText });

export const replayUpdate = (postId, commentId, replyId, replyText) =>
  api.put(`/post/${postId}/comment/${commentId}/reply/${replyId}`, { replyText });
export const replayDelete = (postId, commentId, replyId,) =>
  api.delete(`/post/${postId}/comment/${commentId}/reply/${replyId}` );
export const likeTogle = (postId) => api.put(`/post/${postId}/like`);

export const commetLikeToggle = (postId, commentId) => api.put(`/post/${postId}/comment/${commentId}/like`)
export const replyLikeToggle = (postId, commentId, replyId) => api.put(`/post/${postId}/comment/${commentId}/reply/${replyId}/like`)
export const getposts = (postPage = 1, commentPage = 1, replyPage = 1) => {
  return api.get("/posts", {
    params: { postPage, commentPage, replyPage },
  });
};

// Notification
export const getNotification = (userId) => api.get(`/notification/get`)
export const markNotificationAsRead = (id) => api.put(`/notification/${id}/red`)

export default api;
