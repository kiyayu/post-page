import express from 'express'
import { createComment, createPost, createReply, deleteComment, deletePost, deleteReply, getComments, getPopularPosts, getpost, getPostById, getUserPost, toggleCommentLike, toggleLike, toggleReplyLike, updateComment, updatePost, updateReplay } from '../controllers/postController.js'
import upload from '../middleware/postImage.js'
import {auth} from '../middleware/auth.js'
 
const router = express.Router() 

router.post("/post", auth, upload.single("file"), createPost)
router.get("/post", auth, getpost) 
router.put("/post/:postId", auth, upload.single("file"), updatePost) 
router.delete("/post/:postId", auth, deletePost)
router.get('/post/:postId', auth, getPostById)
router.post("/comment/:postId", auth, createComment) 
router.get("/comment/:postId", auth, getComments)
router.put("/post/:postId/comment/:commentId", auth, updateComment); 
router.delete("/post/:postId/comment/:commentId", auth, deleteComment);
router.post("/post/:postId/comment/:commentId/reply", auth, createReply);
router.put("/post/:postId/comment/:commentId/reply/:replyId", auth, updateReplay)
router.delete("/post/:postId/comment/:commentId/reply/:replyId", auth, deleteReply)
router.put("/post/:postId/like", auth, toggleLike)
router.put("/post/:postId/comment/:commentId/like", auth, toggleCommentLike)
router.put("/post/:postId/comment/:commentId/reply/:replyId/like", auth, toggleReplyLike)
router.get("/user/posts/:id", auth, getUserPost);  
router.get("/posts/popular", auth, getPopularPosts)
export default router   