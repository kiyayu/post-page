import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ListPost from "./ListPost";
import { getPost, deletePost, updatePost } from "../services/api";
import { FaPlus, FaSearch } from "react-icons/fa";
import Sidebar from "./Sidebar";
import AddPost from "./AddPost";
import { useLocation } from "react-router-dom";
const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [perPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("")
  const [selectedPopular, setSelectedPopular] = useState("")
  const [addPostModal, setaddPostModal] = useState(false)
   const location = useLocation(); 
  const [postId, setPostId] = useState(location.state?.postId || null);
 
 
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPost({
        page,
        perPage,
        sortBy,
        order,
        category: selectedCategory,
        search: serchTerm,
        title: selectedTitle,
        popular: selectedPopular,
        postId
      });
      setPosts(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sortBy, order, selectedCategory, serchTerm, selectedTitle, selectedPopular , postId]);

  const handleDelete = useCallback(async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }, []);

  const handleUpdate = useCallback(async (postId, updatedPost) => {
    try {
      const response = await updatePost(postId, updatedPost);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? response.data : post))
      );
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1); // Reset to first page
  };
 const handleAddPostModal = () =>{
  setaddPostModal(!addPostModal)
 }

  const handleBackToMainFeed = () => {
    setPostId(null); // Clear specific post filter
    setPage(1); // Reset to first page
    setSearchTerm(""); // Clear search
    setSortBy("createdAt"); // Reset sorting
    setOrder("desc"); // Reset order
    setSelectedCategory(""); // Clear category filter
    setSelectedTitle(""); // Clear title filter
    setSelectedPopular(""); // Clear popular filter
    fetchPosts(); // Refetch posts with default settings
  };

  
  return (
    <div className=" flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-800 dark:text-white  ">
      
        {addPostModal && (
        <motion.div 
          className=" w-full fixed z-[100]  h-screen  bg-gray-900  bg-opacity-70    ">
        <AddPost close={handleAddPostModal} post={fetchPosts} closeModal={handleAddPostModal} />
         </motion.div>
        )}
     
      <Sidebar onCategoryClick={setSelectedCategory} onSortChange={handleSortChange} onTitleClick={setSelectedTitle} onPopular={setSelectedPopular} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow w-full md:w-4/6 px-4"
      >
        {/* Desktop Header */}
        <div className="hidden md:flex sticky top-[6vh] dark:bg-gray-800 dark:text-white z-30 bg-white p-4 shadow-md rounded-lg justify-between    items-center mb-4">
          <input
            type="text"
            className="border w-1/2 px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white"
            placeholder="Search posts"
            value={serchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <motion.button
           onClick={handleAddPostModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-green-500 text-white border flex items-center gap-2 dark:bg-gray-800 dark:text-white"
          >
            <FaPlus /> Add Post
          </motion.button>
        </div>
        {/* Desktop Header */}
        <div className=" flex md:hidden sticky top-[6vh] dark:bg-gray-800 dark:text-white z-30 bg-white p-4 shadow-md rounded-lg justify-between    items-center mb-4">
          <input
            type="text"
            className="border w-1/2 px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white"
            placeholder="Search posts"
            value={serchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <motion.button
            onClick={handleAddPostModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-green-500 text-white flex items-center gap-2 dark:bg-gray-800 dark:text-white"
          >
            <FaPlus /> Add Post
          </motion.button>
        </div>


        <ListPost
         fetchPosts={fetchPosts}
          posts={posts}
          loading={loading}
          page={page}
          totalPages={totalPages}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          setPage={setPage}
          refresh={handleBackToMainFeed}
        />
        
      </motion.div>
      {/* Right Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block md:w-1/6 dark:bg-gray-800 dark:text-white bg-white p-4 shadow-lg self-start sticky  dark top-[8vh]"
      >
        <h3 className="font-semibold mb-4">Advertisements</h3>
        {/* Add your advertisement content here */}
      </motion.div>
    </div>
  );
};
export default PostsList;
