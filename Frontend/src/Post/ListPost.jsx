import React, { useState, useContext, useEffect } from "react";
import { FaTrash, FaEdit, FaThumbsUp, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { MdMoreVert, MdRefresh} from 'react-icons/md';
import PostCommet from "./PostCommet";
import { AuthContext } from '../context/AuthContext';
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { likeTogle } from "../services/api";
import UpdatePost from "./UpdatePost";
import { toast } from "react-toastify";

const ListPost = ({ posts, loading, page, totalPages, handleDelete, handleUpdate, setPage, fetchPosts, refresh }) => {
    const { user } = useContext(AuthContext);
    const [commetModal, setCommetModal] = useState({});
    const [actionButton, setActionButton] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});  
    const [updatedPosts, setUpdatedPosts] = useState(posts);  
    const [updatePostModal, setUpdatePostModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const toggleUpdateModal = (id = null) => {
        setUpdatePostModal(!updatePostModal);
        setSelectedPostId(id);
    };
    // Handle comment toggle
    const toggleComment = (postId) => {
        setCommetModal((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleLike = async (postId) => {
        // Step 1: Optimistically update the UI
        setUpdatedPosts((prevPosts) =>
            prevPosts.map((post) =>
                post._id === postId
                    ? { ...post, likeCount: post.likeCount + (likedPosts[postId] ? -1 : 1) }
                    : post
            )
        );

        setLikedPosts((prev) => ({
            ...prev,
            [postId]: !likedPosts[postId],  
        }));

        // Step 2: Send the API request to update the backend
        try {
            const response = await likeTogle(postId);
            const { likedByUser, likesCount } = response.data;

            // Step 3: Sync the local state with the real data from the backend
            setUpdatedPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? { ...post, likeCount: likesCount }
                        : post
                )
            );

            setLikedPosts((prev) => ({
                ...prev,
                [postId]: likedByUser,  
            }));

            toast.success(<><FaThumbsUp /></>);
        } catch (error) {
            console.error("Error liking post", error);
            
        }
    };




     
    useEffect(() => {
        setUpdatedPosts(posts);
    }, [posts]);

    // Handle outside click to close the options menu
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest(".more-options")) {
                setActionButton(null);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    

    return (
        <div className="w-full mx-auto p-2 dark:bg-gray-800 dark:text-white  ">
        <div onClick={refresh} className="relative"><span className="fixed top-[19vh] right-1 md:right-[40vh] z-[2000] font-serif cursor-pointer hover:scale-150 "> <MdRefresh /></span></div>
            {updatePostModal && (
                <UpdatePost close={() => toggleUpdateModal()} postId={selectedPostId} fetchPosts={fetchPosts} />
            )}
            {loading ? (
                <div className="flex justify-center mt-[10vh] h-screen">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : updatedPosts.length > 0 ? (
                updatedPosts.map((p) => (
                    <div
                        key={p._id}
                        className="border relative p-4  dark:bg-gray-800 dark:text-white mb-4 rounded-lg shadow-lg bg-white flex flex-col flex-wrap hover:shadow-xl transition-all ">
                        <p className="text-gray-900 dark:text-white font-semibold p-2 font-serif  text-xl">{p.title}</p>
                        <p className="text-gray-700 dark:text-white text-base   p-2">{p.content}</p>

                        {p.file && (
                            <img
                                src={p.file}
                                alt="Post Image"
                                className="w-full h-80 rounded-lg object-fill dark:text-white"
                                loading="lazy"
                            />
                        )}

                        <div className="flex justify-between items-center dark:text-white">
                            <div className="flex items-center gap-5 p-3">
                                <img src={p.author.profile} alt="" className="w-10 h-10 object-fill rounded-full" />
                                {p.author && (
                                    <p className="text-sm text-gray-500 flex flex-col dark:text-white">
                                        By: {p.author.name}  
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-5">
                                <div className="mr-10">
                                    <motion.p
                                        whileTap={{ scale: 1.2 }}
                                        transition={{ duration: 0.1 }}
                                        className="font-mono text-sm dark:text-white text-gray-600 flex items-center gap-2"
                                    >
                                        <motion.span
                                            whileTap={{ rotate: likedPosts[p._id] ? -40 : -40, scale: 1.4 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FaThumbsUp
                                                onClick={() => handleLike(p._id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: likedPosts[p._id] ? 'green' : 'gray',  
                                                }}
                                            />
                                        </motion.span>
                                        {p.likeCount}
                                    </motion.p>
                                </div>
                                <div className="text-sm text-gray-600 flex items-center">
                                    <p className="flex gap-2 items-center dark:text-white" onClick={() => toggleComment(p._id)}>
                                        comments {p.commentCount}{' '}
                                        <span className="text-green-500 font-extrabold">
                                            {commetModal[p._id] ? <FaArrowUp /> : <FaArrowDown />}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <span className="ml-14 text-sm text-gray-600 dark:text-white">
                            {p.createdAt
                                ? formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })
                                : 'Unknown'}
                        </span>

                        {p.author._id === user._id && (
                            <motion.span whileHover={{rotate: actionButton ? 90: 0}} transition={{duration: 0.2}} 
                                onClick={() => setActionButton(p._id)}
                                className="more-options absolute top-1 right-2 text-green-700 font-bold hover:text-gray-100 transition-all ease-in-out duration-500 hover:bg-gray-500 rounded-full p-2"
                            >
                                <MdMoreVert />
                            </motion.span>
                        )}

                        {actionButton === p._id && (
                            <motion.div
                                onClick={(e) => e.stopPropagation()}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="flex border dark:bg-gray-800 dark:text-white flex-col rounded mt-4 absolute top-6 right-0 gap-3 px-5 text-white bg-green-500 p-3 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleUpdateModal(p._id)}
                                    className="flex items-center gap-4 hover:text-blue-700"
                                >
                                    <FaEdit /> Update
                                </button>
                                <button
                                    onClick={() => handleDelete(p._id)}
                                    className="flex items-center gap-4 hover:text-red-700"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </motion.div>
                        )}

                        {commetModal[p._id] && (
                            <>
                                {p.comments.length > 0 ? (
                                    <PostCommet postId={p._id} />
                                ) : (
                                    <p className="text-gray-400">No comments yet.</p>
                                )}
                            </>
                        )}
                    </div>
                ))
            ) : (
                        <p className="text-center text-gray-500 dark:text-white">No posts found.</p>
            )}

            <div className="flex justify-center mt-6">
                <button
                    className="mr-2 px-6 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 disabled:bg-gray-400"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <button
                    className="px-6 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300 disabled:bg-gray-400"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListPost;
