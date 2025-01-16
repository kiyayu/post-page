import React, { useContext, useEffect, useState } from 'react';
import ReplyComment from './ReplyComment';
import { commetLikeToggle, createComment, deleteComment, getComment, updateComment } from '../services/api';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaEdit, FaReply, FaRegThumbsUp, FaTrash, FaArrowDown, FaArrowUp, FaThumbsUp } from 'react-icons/fa';
import { toast } from 'react-toastify';

function PostCommet({ postId }) {
  const { user } = useContext(AuthContext);
  const [commentData, setCommentData] = useState({});
  const [page, setPage] = useState(1);
  const [replyModal, setReplyModal] = useState({});
  const [editComment, setEditComment] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [updatedCommentTexts, setUpdatedCommentTexts] = useState({})
  const [isUserLiked, setIsUserLiked] = useState({})
  const handleCommentChange = (postId, value) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: value }));   
  };

  const handleUpdatedCommnetTextChnage = (commentId, value)=>{
      setUpdatedCommentTexts((prev) => ({...prev, [commentId]:value}))
  }
  
  const toggleReply = (commentId) => {
    setReplyModal((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };
  // toggle comment like
  const toggleCommmentLike = async (postId, commentId) => {
    try {
      const response = await commetLikeToggle(postId, commentId);
       fetchCommet(postId)
       setIsUserLiked((prev) => ({...prev, [commentId]:!prev[commentId]}))
      setCommentData((prevData) => ({
        ...prevData,
        [postId]: (prevData[postId] || []).map((comment) =>
          comment._id === commentId
            ? {
              ...comment,
              likes: response.data.likes,  
              likeCount: response.data.likeCount,
            }
            : comment
        ),
      }));
      toast.success(<><FaThumbsUp /></>)
    } catch (error) {
      console.error('error', error);
    }
  };


  // Fetch comments for a specific postId
  const fetchCommet = async (postId) => {
    try {
      const response = await getComment(postId, { page });
      setCommentData((prev) => ({
        ...prev,
        [postId]: response.data.comments,  
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    }
  };

  useEffect(() => {
    fetchCommet(postId);  
  }, [postId]);

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();

    const commentText = commentTexts[postId] || ''; 
    console.log(" this si comment text",commentText)
    console.log("this is post id", postId)
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty!');
      return;
    }

    try {
      await createComment(postId, commentText);  
      toast.success('Comment added!');
      fetchCommet(postId);  
      setCommentTexts((prev) => ({
        ...prev,
        [postId]: '',  
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleCommentEdit = (commentId, commentText) => {
    setEditComment(true);
    setSelectedCommentId(commentId);
    setUpdatedCommentTexts((prev) => ({...prev, [commentId]:commentText}))
  };
  
  const handleCommentCancle = (postId, commentId) =>{
    setEditComment(false)
    setUpdatedCommentTexts((prev)=> ({...prev, [commentId]: ''}))
  }
  
  const handleCommentUpdatesubmit = async( postId, commentId) =>{
    
    const updatedCommentText = updatedCommentTexts[commentId]
      try{
        const response = await updateComment(postId, commentId, updatedCommentText)
        fetchCommet(postId)
         setEditComment(false)
        toast.success("comment updated successfully")
      }catch (error){
        console.error("error", error)
        toast.error("comment updated failed")
      }

  }
   const handleCommentDelete = async (postId, commentId)=>{ 
    if(!window.confirm("do you want to delete comment?")){
      return
    }
    try{
      await deleteComment(postId, commentId)
      fetchCommet(postId)
      toast.success('post deleted!')

    }catch (error) {
      console.error("error", error)
      toast.error("comment delte is faild")
    }
   }

  return (
    <motion.div
      className="mt-4 p-2 bg-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
      initial={{ y: -5, scale: 0.5 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="mb-2">Post Title</h1>
        <form onSubmit={(e) => handleCommentSubmit(e, postId)} className="flex gap-3 items-center mb-2">
          <textarea
            placeholder="Write your comment..."
            value={commentTexts[postId] || ''} // Dynamically access comment text for this post
            onChange={(e) => handleCommentChange(postId, e.target.value)} // Handle text input for this post
            className="w-[90%] mb-2 dark:bg-gray-800 dark:text-white px-3 p-1 rounded-lg focus:outline-none focus:ring border"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="px-5 dark:bg-gray-800 dark:border dark:border-white dark:text-white md:px-10 p-2 mb-2 bg-green-600 rounded-lg text-gray-100"
          >
            Comment
          </motion.button>
        </form>
      </div>
      {/* Render comments for this post */}
      {(commentData[postId] || []).map((comment) => (
        <motion.div
          key={comment._id}
          className=" rounded-lg mb-4 flex gap-2 "
          initial={{ y: -5, scale: 0.5 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center flex-col g min-w-[50px] p-2 rounded-lg">
            <img
              src={comment.userId?.profile}
              alt="User Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
            />
            <p className="text-gray-800 dark:text-white font-medium truncate first-letter:uppercase">
              {comment.userId?.name}
            </p>
          </div>


          <div className="">
          {selectedCommentId === comment._id && editComment ? (
            <div className="flex justify-between items-center">
              <input
                className="w-[90%] mb-2 px-3 p-1 rounded-lg focus:outline-none focus:ring border"
                type="text"
                name=""
                onChange={(e) => handleUpdatedCommnetTextChnage(comment._id, e.target.value)}
                value={updatedCommentTexts[comment._id || '']}
                id=""
              />
              <div className=" flex gap-2 px-2">
                <button className='bg-green-500 text-gray-200 p-1 rounded-lg  font-serif' onClick={()=>handleCommentUpdatesubmit(postId, comment._id)}>Save</button>
                <button className='bg-gray-500 p-1 rounded-lg text-red-600  font-serif' onClick={() => handleCommentCancle(postId, comment._id)}>Cancle</button>
              </div>
            </div>
          ) : (
                <p className="text-gray-900 ml-3 dark:text-white">{comment.commentText}</p>
          )}

          <div className="flex gap-3">
            {user._id === comment.userId._id && (
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                    className="text-green-900 font-sans dark:bg-gray-800 dark:text-white rounded-lg flex gap-2 items-center text-xs border px-5"
                  onClick={() => handleCommentEdit(comment._id, comment.commentText)}
                >
                  <FaEdit />
                  Edit
                </motion.button>
                <motion.button
                 onClick={() =>  handleCommentDelete(postId, comment._id)}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 text-red-500 dark:bg-gray-800 dark:text-white border-slate-300 border text-xs px-3 rounded"
                >
                  <FaTrash />
                  Delete
                </motion.button>
              </div> 
              
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
                className="text-green-700 border dark:bg-gray-800 dark:text-white px-5 rounded flex items-center gap-3"
              onClick={() => toggleReply(comment._id)}
            >
              <span className="flex flex-row-reverse items-center gap-2">
             {replyModal[comment._id] && (<motion.div animate={{rotate:toggleReply ? 180: 0}} transition={{duration:.3}}><FaArrowDown /></motion.div>)}  Reply  <FaReply />
              </span>
              
              <span>{comment.replies.length}</span>
            </motion.button>
            <motion.div  onClick={() => toggleCommmentLike(postId, comment._id)} className="flex gap-3 items-center">
             <motion.span whileTap={{rotate: toggleCommmentLike ? -90:0, scale:2}}  
                  className={`${isUserLiked[comment._id] ? 'text-green-600' : "text-gray-800"} transition-all duration-300 dark:bg-gray-800 dark:text-white`}> <FaRegThumbsUp /> </motion.span> <span>{comment.likesCount}</span>
            </motion.div>
          </div>      {replyModal[comment._id] && (
            <>
               
                <div>
                    <ReplyComment reply={comment.replies} postId={postId} commentId={comment._id} fetchCommet={fetchCommet} />
                </div>
              
            </>
          )}
          </div>
     
        </motion.div>
      ))}
    </motion.div>
  );
}

export default PostCommet;