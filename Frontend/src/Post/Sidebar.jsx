import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaHome, FaSort, FaCog, FaBars, FaThLarge, FaFire, FaThumbsUp, FaComment } from "react-icons/fa";
import { getCategories, getPopularPosts, getYourPost } from "../services/api";
import { AuthContext } from '../context/AuthContext'

const Sidebar = ({ onCategoryClick, onSortChange, onTitleClick, onPopular }) => {
    const {user} = useContext(AuthContext)
    const [categories, setCategories] = useState([]);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [popularPosts, setPopularPosts] = useState([]);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [myPost, setMyPost] = useState([])
    const [isMyPostOpen, setIsMyPostOpen] = useState(false)
    const sortRef = useRef(null);
    const categoriesRef = useRef(null);
    const mypostRef = useRef(null)


    const sortOptions = [
        { value: "createdAt", label: "Date Created" },
        { value: "title", label: "Title" },
    ];

    const handleSort = (sortBy, order, e) => {
        e.stopPropagation();
        onSortChange(sortBy, order);
        setIsSortOpen(false);
    };
    const getUserPosts = async () => {
        try {
            if (!user?._id) return; // Ensure user ID is available
            const response = await getYourPost(user._id);
            setMyPost(response.data.posts);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };
    useEffect(() =>{
     getUserPosts()   
    }, [user])
    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileSidebarOpen(window.innerWidth >= 768);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
                setIsCategoriesOpen(false);
            }
            if (mypostRef.current && ! mypostRef.current.contains(event.target)){
                setIsMyPostOpen(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handlePopularPosts = async () =>{
     try{
        const response = await getPopularPosts()
        setPopularPosts(response.data.data)
     }
     catch (error){
        console.error("error", error)
     }
    }
    useEffect(()=>{
        handlePopularPosts()
    }, [])

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed bottom-4 right-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            >
                <FaBars className="text-xl" />
            </button>

            {/* Sidebar */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: isMobileSidebarOpen ? 0 : -300 }}
                transition={{ type: "spring", damping: 20 }}
                className={`fixed md:relative left-0 top-0 h-full w-[280px] md:w-1/6 bg-white z-50 p-6    shadow-lg flex flex-col
                    ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
                    transition-transform duration-300 ease-in-out md:sticky md:top-[8vh]   dark:bg-gray-800 dark:text-white`}
            >
                <nav className="space-y-6 dark:bg-gray-800 dark:text-white">
                    <motion.li
                        ref={mypostRef}
                        whileHover={{ x: 10 }}
                        className=" relative z-[100]  bg-white list-none "
                        onClick={(e) => {setIsMyPostOpen(!isMyPostOpen), e.stopPropagation()}}
                    >
                        <div className="flex items-center justify-between dark:bg-gray-800 dark:text-white text-gray-700 hover:text-green-500 cursor-pointer" >
                        <div className="flex gap gap-3 items-center "> 
                        <FaHome className="text-xl" />
                        <span className="text-lg">Your Post</span>
                        </div>

                        <motion.div
                        
                        animate={{rotate: isMyPostOpen ? 180 : 0}} 
                        transition={{duration: 0.2}}
                         className="text-xl"n><FaChevronDown />
                         
                          </motion.div>
                        </div>
                        <div className=" ">  
                         {isMyPostOpen && (
                                <div className="absolute left-0 mt-2 h-[50vh] overflow-y-auto dark:bg-gray-800 dark:text-white shadow-lg w-72 px-5 pb-5 bg-white" >
                        {myPost.length > 0 ? (
                        <>
                        {myPost.map((p, index) =>
                        { 
                            const truncatedTitle = p.title.split(" ").slice(0, 2).join(" ");
                            return (
                                <motion.div className="flex gap-2 items-center p-2 dark:bg-gray-800 dark:text-white" 
                             key={p._id} onClick={(e) => {onTitleClick(p.title), e.stopPropagation() }}>
                                   <div className="">
                                      <img className="w-24 h-16" 
                                       src={p.file} alt="" />
                                   </div> 
                                    <motion.p whileHover={{ scale: 1.1 }} className="p-2 hover:text-green-500 dark:text-white mt-1 cursor-pointer text-gray-700 font-sans shadow-lg">
                                        <span className="text-gray-600 px-1 dark:text-white">{index + 1}</span>
                                        {truncatedTitle}{p.title.split(" ").length > 4 ? "..." : ""}</motion.p>
                           
                           </motion.div>
                        )})}
                        </>)
                        : (<> 
                        <p>No Post Yet!</p>
                        </>)}
                         
                        </div>)}
                        </div>
                      
                    </motion.li>

                    {/* Sort Dropdown */}
                    <motion.li
                        ref={sortRef}
                        whileHover={{ x: 10 }}
                        className="relative z-50 list-none dark:bg-gray-800 dark:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsSortOpen(!isSortOpen);
                        }}
                    >
                        <div className="flex items-center justify-between dark:bg-gray-800 dark:text-white text-gray-700 hover:text-green-500 cursor-pointer" >
                            <div className="flex items-center gap-3">
                                <FaSort className="text-xl" />
                                <span className="text-lg">Sort</span>
                            </div>
                            <motion.div
                                animate={{ rotate: isSortOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaChevronDown className="text-xl" />
                            </motion.div>
                        </div>

                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute mt-2 w-48 bg-white shadow-lg rounded-md dark:bg-gray-800 dark:text-white z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {sortOptions.map((option) => (
                                        <div key={option.value} className="p-2 ">
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm dark:bg-gray-800 dark:text-white text-gray-700 hover:bg-green-50 hover:text-green-700 rounded"
                                                onClick={(e) => handleSort(option.value, "asc", e)}
                                            >
                                                ↑ {option.label} Ascending
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-white hover:bg-green-50 hover:text-green-700 rounded"
                                                onClick={(e) => handleSort(option.value, "desc", e)}
                                            >
                                                ↓ {option.label} Descending
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.li>

                    {/* Categories Dropdown */}
                    <motion.li
                        ref={categoriesRef}
                        whileHover={{ x: 10 }}
                        className="relative list-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCategoriesOpen(!isCategoriesOpen);
                        }}
                    >
                        <div className="flex items-center justify-between gap-3 text-gray-700 dark:bg-gray-800 dark:text-white hover:text-green-500 cursor-pointer">
                            <div className="flex items-center gap-3 ">
                                 <FaThLarge />  
                            <span className="text-lg">Categories</span>
                            </div>
                            <motion.div
                                animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                           <FaChevronDown className="text-xl" />
                           </motion.div>
                        </div>

                        <AnimatePresence>
                            {isCategoriesOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute list-none bg-white shadow-lg rounded-md z-50 mt-2 w-48 p-2 dark:bg-gray-800 dark:text-white"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <li
                                        className="text-gray-600 hover:text-green-400 cursor-pointer p-2 list-none dark:bg-gray-800 dark:text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCategoryClick("");
                                        }}
                                    >
                                        All Categories
                                    </li>
                                    {categories.map((cat) => (
                                        <li
                                            key={cat.id}
                                            className="text-gray-600 hover:text-green-400 cursor-pointer p-2 list-none dark:bg-gray-800 dark:text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCategoryClick(cat.name);
                                            }}
                                        >
                                            {cat.name}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.li>

                    <motion.li className="flex flex-col    items-center justify-between  gap-3 dark:bg-gray-800 dark:text-white text-gray-700 hover:text-green-500 cursor-pointer">
                     <div className=" flex w-full  gap-3">
                        <FaFire className="text-xl" />
                        <span className="text-lg">Popular</span>
                        </div>

                        <AnimatePresence>
                            <motion.div
                               
                                className=" overflow-y-auto mt-2 w-62 h-[400px] dark:bg-gray-800 dark:text-white bg-white shadow-lg rounded-md p-4"
                            >
                                {popularPosts.length > 0 ? (
                                    popularPosts.map((post) => { 
                                        const tranquatedTitle = post.title.split(" ").slice(0, 4).join(' ')
                                        return (
                                            <motion.div key={post._id} onClick={() => onPopular(post.title)} className="flex dark:bg-gray-800 dark:text-white  flex-col gap-3 p-2 hover:bg-gray-50 cursor-pointer">
                                                <div className="flex flex-col  gap-1 p-3 bg-white shadow-md rounded-md dark:bg-gray-800 dark:text-white">
                                                    <h3 className="text-lg font-bold text-gray-700 dark:bg-gray-800 dark:text-white">{tranquatedTitle }{post.title.length > 4 ? '...': ''}</h3>
                                                    <div className="flex  gap-2 items-center justify-between dark:bg-gray-800 dark:text-white"> 
                                                        <p className="text-sm text-gray-500 dark:bg-gray-800 dark:text-white">By: {post.author.name}</p> 
                                                     <div className="flex gap-4">
                                                            <motion.span className="flex hover:text-green-500 items-center gap-2 text-gray-500 dark:bg-gray-800 dark:text-white" whileHover={{scale: 1.1}} > <FaThumbsUp /> {post.likeCount} </motion.span>
                                                            <motion.span className="flex hover:text-green-500 items-center gap-2 text-gray-500 dark:bg-gray-800 dark:text-white" whileHover={{scale:1.1}}>  <FaComment /> {post.commentCount} </motion.span>
                                                     </div>
                                                </div>
                                               
                                                {post.file && (
                                                    <img src={post.file} className="w-full h-20  rounded-lg object-fill" alt="" />
                                                )}
                                            </div>
                                        </motion.div>
                                    )})
                                ) : (
                                    <p>No popular posts yet!</p>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.li>

                </nav>
                <div className="mt-auto pt-6 border-t">
                    <p className="text-sm text-gray-500">© 2024 My App</p>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;
