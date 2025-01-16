import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import {FaEdit, FaTrash, FaRegThumbsUp} from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { replayComment, replayDelete, replayUpdate, replyLikeToggle } from '../services/api'
const ReplyComment = ({reply, postId, commentId , fetchCommet}) => {
  const {user} = useContext(AuthContext)
  const [replyTexts, setReplyTexts] = useState({})
  const [replyUpdateTexts, setReplyUpdateTexts] = useState({})
  const [editReply, setEditReply] = useState(false)
  const [selectedReplyId, setSelectedReplyId] = useState(null)
  const [isUserLiked, setIsUserLiked] = useState({})
  

  const handlereplyTestsChange = (commentId, value) =>{
    setReplyTexts((prev) => ({...prev, [commentId]:value}))
  }

  const handleReplyUpdateTexts = (replyId, value) =>{
    setReplyUpdateTexts((prev) => ({...prev, [replyId]:value }))
  }
  
   const handlereplySubmit = async(e) =>{
    e.preventDefault()
    try{
      const replyText = replyTexts[commentId]
      await replayComment(postId, commentId, replyText)
      toast.success("success!")
      fetchCommet(postId)
      
    }
    catch (error) {
      console.error("error", error)
      toast.error("error")
    }
   }

   const handleReplyUpdateSubmit = async(replyId) => {
    const replUpdateText = replyUpdateTexts[replyId]
    try{
      await replayUpdate(postId, commentId, replyId, replUpdateText)
      fetchCommet(postId)
      toast.success("reply Updated")
      setEditReply(false)
    }
    catch (error) {
      console.error('error', error)
      toast.error('error', error)
    }
   }

   const handleReplyEdit = (replyId, replyText) => {
     setEditReply(true)
     setReplyUpdateTexts((prev) => ({...prev, [replyId]:replyText}))
    setSelectedReplyId(replyId)

   }
   const handleReplyCancle = () => {
    setEditReply(false)
   }
   const handleReplyDelete = async (replyId) => {
    if(!window.confirm("do you want delete reply ?")){
      return
    }
    try{
      await replayDelete (postId, commentId, replyId)
      fetchCommet(postId)
      toast.success("reply Deleted!")

    }
    catch(error){
      console.error("error", error)
      toast.error("reply delete faild")
    }

   }
   const toggleReplyLike = async (replyId) =>{
    try{
      await replyLikeToggle(postId, commentId, replyId)
      setIsUserLiked((prev) => ({...prev, [replyId]:!prev[replyId]}))
      fetchCommet(postId)
      toast.success(<motion.div  transition={{duration:.3}}><FaRegThumbsUp /></motion.div>)
    }
    catch (error) {
      console.error('error',error)
    }
   }

  return (
    <div>
          <div  >
        <div className='mt-2 p-3 dark:bg-gray-800 dark:text-white'>
                 
          <form onSubmit={handlereplySubmit} className=" dark:bg-gray-800 dark:text-white flex gap-3 items-center mb-2">
                      <input
                        placeholder="Write your reply..."
                        value={replyTexts[commentId] || ''}
                        onChange={(e) => handlereplyTestsChange(commentId, e.target.value)}
              className="w-[90%] mb-2 px-3 p-1 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring border"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
              className="px-5 md:px-10  mb-2 bg-green-600 rounded-lg dark:bg-gray-800 dark:text-white text-gray-100"
                      >
                        reply
                      </motion.button>
                    </form>
                    </div>
              {reply.map((reply) => ( <>      
                <div className="mt-2 flex p-4 bg-gray-300 border  rounded-lg dark:bg-gray-800 dark:text-white">    
                
                  <div className="flex flex-col dark:bg-gray-800 dark:text-white">
            <img src={reply.userId.profile} alt="" className='w-5 h-5 rounded-full' />
          
             {reply.userId.name}
            </div>
            <div className="">   
              {selectedReplyId === reply._id && editReply ? (
                      <div className="flex justify-between dark:bg-gray-800 dark:text-white  items-center">
                        <input
                          className="w-[90%] mb-2 px-3 p-1  dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring border"
                          type="text"
                           value={replyUpdateTexts[reply._id] || ''}
                          onChange={(e) => handleReplyUpdateTexts(reply._id, e.target.value)}
                        />
                        <div className=" flex gap-2 px-2 dark:bg-gray-800 dark:text-white">
                          <button onClick={() => handleReplyUpdateSubmit(reply._id)} className='bg-green-500 dark:bg-gray-800 dark:text-white text-gray-200 p-1 rounded-lg  font-serif'  >Save</button>
                          <button onClick={handleReplyCancle} className='bg-gray-500 p-1 rounded-lg text-red-600 dark:bg-gray-800 dark:text-white  font-serif'  >Cancle</button>
                        </div>
                      </div>) 
                      : (<><p className="text-sm dark:bg-gray-800 dark:text-white text-gray-600">{reply.replyText}</p></>) }
              
                    <div className="flex justify-between dark:bg-gray-800 dark:text-white gap-3 text-xs text-gray-500 mt-2">
             
              {user._id === reply.userId._id && (
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                            className="text-green-900 font-sans dark:bg-gray-800 dark:text-white rounded-lg flex gap-2 items-center text-xs border px-5"
                     onClick={() => handleReplyEdit(reply._id, reply.replyText)}
                  >
                    <FaEdit />
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleReplyDelete(reply._id)}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 text-red-500 dark:bg-gray-800 dark:text-white border-slate-300 border text-xs px-3 rounded"
                  >
                    <FaTrash />
                    Delete
                  </motion.button>
                </div>

              )}
              <motion.div onClick={() => toggleReplyLike(reply._id)} className="flex gap-3 items-center">
                        <motion.span whileTap={{ rotate: toggleReplyLike ? -40 : 40, scale: 1.6 }} transition={{ duration: .4 }} className={`${isUserLiked[reply._id] ? "text-green-500" : 'text-gray-700 dark:bg-gray-800 dark:text-white'}`}><FaRegThumbsUp /> </motion.span><span>{reply.likesCount}</span>
                          </motion.div>
              </div>
              </div>
              
              </div>
              </>))}
          </div>

    </div>
  )
}

export default ReplyComment
