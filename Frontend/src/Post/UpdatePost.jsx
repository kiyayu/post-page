import React, {useEffect, useState} from 'react';
import { MdClose } from 'react-icons/md';
import { motion } from 'framer-motion';
import { getCategories, updatePost, getPostByid } from '../services/api';
import { toast } from 'react-toastify';
const max_Title = 70
const max_Content = 10000;
const UpdatePost = ({ close, postId, fetchPosts }) => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({title:'', content:'', categories:[], file:null })
  const [originalData, setOriginalData] = useState({
    title: '',
    content: '',
    categories: [],
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false)
 

  const fetchPost = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await getPostByid(postId);  
      const postData = {
        title: response.data.title || '',
        content: response.data.content || '',
        categories: response.data.categories || [],
        file: null,
      };
      setFormData(postData);
      setOriginalData(postData)
    } catch (error) {
      console.error('Error fetching post:', error);
      // Optionally handle errors (e.g., show error message)
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleReset = () => {
    setFormData(originalData);
  };


  useEffect(() =>{
    fetchPost()
  },[])

  const fetchCategories = async() => {
  try{
  const response = await getCategories()
  setCategories(response.data)
  } catch (error) {
  console.error('error', error)
  }
  }
  useEffect(() => {
  fetchCategories()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? files[0] : value,
    }));
  };

  const handleCategoriesClick = (id) =>{
    setFormData((prev) => ({...prev, categories:prev.categories.includes(id)? prev.categories.filter((catId) => catId !== id): [...prev.categories, id]}))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formToSend = new FormData();
    formToSend.append("title", formData.title);
    formToSend.append("content", formData.content);
    formData.categories.forEach((cat) =>
      formToSend.append("categories[]", cat)
    );
    if (formData.file) {
      formToSend.append("file", formData.file);
    }

    try {
      setIsLoading(true); // Corrected
      await updatePost(postId, formToSend);
      fetchPosts()
      toast.success("Post successfully updated!");
      close()
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Something went wrong, try again!");
    } finally {
      setIsLoading(false); // Corrected
    }
  };


  return (
    <div className="fixed inset-0   dark:text-white   bg-slate-800 bg-opacity-90 w-full  " style={{ zIndex: 1003 }}>
      <motion.div initial={{height:0}} animate={{height:'100vh'}} transition={{duration: 0.3}}
        className="mt-[9vh] overflow-y-auto shadow-lg h-auto dark:bg-gray-800 dark:text-white  relative bg-slate-100 max-w-lg md:max-w-xl p-3 mx-auto rounded-lg">
      <motion.span whileHover={{rotate:90}}  transition={{duration:.2}}
          onClick={close} aria-label='close' className=" dark:bg-gray-800 dark:text-white absolute top-2 right-3 cursor-pointer p-1 text-gray-700 rounded-full hover:bg-gray-500 hover:text-gray-300 ">
        <MdClose size={24} />
      </motion.span>
        <h1 className="text-gray-500 font-serif text-center p-3 dark:bg-gray-800 dark:text-white">Update Post</h1>
      <form onSubmit={handleSubmit} className=' p-2 ' aria-label='form to-update'>
        <div className="mb-4">
            <div className="flex justify-between items-center"><label htmlFor="title" className='font-serif text-gray-500 mt-1 dark:bg-gray-800 dark:text-white'>Title</label> <span className={`${formData.title.length > 60 ? 'text-yellow-500': ''} text-xs font-serif`}>{formData.title.length}/ {max_Title}</span></div>
          <input id='title' type="text" placeholder='Title'  
          onChange={handleInputChange} name='title' value={formData.title.slice(0, max_Title)}
              className='w-full p-2 dark:bg-gray-800 dark:text-white rounded focus:outline-none focus:ring border border-slate-300'/>

        </div>
        <div className="mb-4">
            <div className="flex  justify-between items-center"> <label htmlFor="content" className='font-serif text-gray-500 mt-1 dark:bg-gray-800 dark:text-white'>Content</label> <span className={`${max_Content.length > 9000?"text-yellow-500":""}font-serif text-xs`}>{formData.content.length} / {max_Content}</span></div> 
          <textarea   id='content' type="content" placeholder='Content'
          onChange={handleInputChange} name='content' value={formData.content.slice(0, max_Content)}
              className='w-full p-2 dark:bg-gray-800 dark:text-white rounded focus:outline-none focus:ring border border-slate-300'/>

        </div>
        <div className="mb-6  ">
            <p className='text-gray-500 font-serif ml-1 dark:bg-gray-800 dark:text-white'>Select Categories</p>
          <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
          <motion.div initial={{opacity:0, scale:.5}} animate={{opacity:1, scale:1}} transition={{duration:.3}}
              key={cat._id} className='flex items-center gap- dark:bg-gray-800 dark:text-white p-3 text-gray-700 font-sans   '>
            <input type="checkbox" checked={formData.categories.includes(cat._id)}
             onChange={() => handleCategoriesClick(cat._id)} />
            {cat.name}
          </motion.div> ))}
          </div>
        </div>

        <div className="mb-10">
            <label htmlFor="file" className='font-serif dark:bg-gray-800 dark:text-white text-gray-500 mt-1'>File</label>
          <input id='file' type="file" placeholder='Title'
          onChange={handleInputChange} name='file'
          className='w-full p-2 rounded focus:outline-none focus:ring border border-slate-300' />

        </div>
        <div className=" flex gap-3 justify-evenly w-full mb-10 ">
            <button aria-label='submit' type='submit' className='bg-green-500 mb-5 dark:bg-gray-800 dark:text-white border text-gray-300 font-serfi px-7 rounded-lg  p-2 '> {isLoading ? <><div className="flex justify-center   ">
              <div className="w-8 h-8 border-4 border-gray-200  border-t-transparent rounded-full animate-spin">

              </div>
            </div> </>: 'update'} </button>
            <button onClick={handleReset} aria-label='cancel' className=' mb-5 bg-gray-500 text-gray-300 font-serfi px-7 rounded-lg  p-2 ' >cancle</button>
        </div>

      </form>
    </motion.div>
    </div>
  );
};

export default UpdatePost;