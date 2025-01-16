import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { createPost, getCategories } from '../services/api'
import { frameData, motion } from 'framer-motion'
import { toast } from 'react-toastify'
const max_Title_length = 70
const max_Content_length = 10000
const AddPost = ({ close, post , closeModal}) => {
  const [categories, setCategories] = useState([])
  const [formData, setFromData] = useState({title:"", content:"", categories:[], file: ''})
  const [isLoading, setIsLoading] = useState(false)

  const handleCategories = (id) =>{
  setFromData((prev) => ({...prev, categories: prev.categories.includes(id) ? prev.categories.filter((catId) => catId !== id) : [...prev.categories, id]}))
  }

  const handleInput = (e) =>{
    const {value, files, name} = e.target;
    setFromData((prev) => ({...prev, [name]:name === 'file'  ? files[0]: value }))
 
  }
  const handlesubmit = async(e) =>{
    e.preventDefault()
    const formdataToSend = new FormData()
    formdataToSend.append("title", formData.title)
    formdataToSend.append("content", formData.content)
    formData.categories.forEach((category) => formdataToSend.append("categories[]", category))
    formdataToSend.append("file", formData.file)
    try{
      setIsLoading(true)
      await createPost(formdataToSend)
      post()
      closeModal()
      toast.success("post crated successfuly")
      setIsLoading(false)
    } catch (error){
      console.error("error")
      toast.error("something is went wrong")
    }
    finally{
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      setCategories(response.data)

    } catch (error) {
      console.error("error", error)
    }
  }
  useEffect(() => {
    fetchCategories()
  }, [])
  return (
    <div>
      <div className=" ">
        <motion.div 
          initial={{ height: 0 }} animate={{ height: "100vh" }} transition={{ duration: .5 }} exit={{ height: 0 }} 
          className="bg-gray-50 dark:bg-gray-800 dark:text-white p-4 rounded max-w-lg mx-auto mt-2 overflow-y-auto shadow-lg shadow-gray-700  relative">
          <motion.span  whileHover={{rotate:90}} transition={{ duration:.3}}
          className='absolute  right-2 p-2 hover:bg-gray-500 hover:text-gray-100 rounded-full font-serif ' onClick={close}><FaTimes /></motion.span>
          <p className='text-center p-2 text-gray-500 font-bold font-serif dark:bg-gray-800 dark:text-white'>Create new post.</p>
          <motion.form onSubmit={handlesubmit} className=' mx-auto  md:max-w-lg p-4' initial={{ height: 0 }} animate={{ height: "auto" }} transition={{ duration: .5 }} exit={{ height: 0 }} >
            <div className="mb-4">
              <label htmlFor="title" className='dark:bg-gray-800 dark:text-white text-gray-500 font-serif flex justify-between'>
                Title:
                <span className={`${formData.title.length > 70 ? " text-red-600" : formData.title.length > 60 ? "text-yellow-600" : ""} text-xs font-sans dark:bg-gray-800 dark:text-white`}>
                  {formData.title.length} / {max_Title_length}
                </span>
              </label>
              <input
                type="text"
                id="title"
                placeholder='Title...'
                onChange={handleInput}
                name='title'
                value={formData.title.slice(0, max_Title_length)}
                className='p-3 dark:bg-gray-800 dark:text-white text-gray-500 border shadow-lg focus:outline-none focus:ring px-3 w-full rounded-lg'
              />
            </div>

            <div className="mb-4">
              <label htmlFor="content" className='dark:bg-gray-800 dark:text-white text-gray-500 font-serif flex justify-between'>Content
                <span className={`${formData.content.length > 950 ? 'text-red-500' : ""} text-gray-700 text-xs font-sans dark:bg-gray-800 dark:text-white`} >{formData.content.length} / {max_Content_length}

               </span>
               </label>
              <textarea id='content' type="text" placeholder='content...' onChange={handleInput} name='content' value={formData.content.slice(0, max_Content_length)}
                className='p-3 dark:bg-gray-800 dark:text-white shadow-lg border focus:outline-none focus:ring px-3 w-full rounded-lg' />
            </div>
            <div className="mb-4">
              <label htmlFor="" className='text-gray-500 font-serif dark:bg-gray-800 dark:text-white'>Select Categoroies</label>
              <div className=" flex gap-3 flex-wrap">
                {categories.map((cat) => (
                  <div className='flex  gap-3'>
                    <input onClick={()=> handleCategories(cat._id)} type="checkbox" />
                    <span className='text-gray-500 dark:bg-gray-800 dark:text-white'>{cat.name}</span>
                  </div>
                ))}
              </div>

            </div>
            <div className="mb-6">
              <label htmlFor="" className='text-gray-500 font-serif dark:bg-gray-800 dark:text-white'>file</label>
              <input type="file" onChange={handleInput}  name='file'
              className='p-3 border focus:outline-none shadow-lg focus:ring px-3 w-full rounded-lg' />
            </div>
            <div className="mb-4 flex" >
              <motion.button whileHover={{scale:1.1}} transition={{duration:.2}} 
                className='bg-green-600 mb-5 px-5 w-[90%] rounded-lg mx-auto p-3 text-gray-100  font-serif dark:bg-gray-800 dark:text-white border'>{isLoading ? 
              <div className="flex justify-center   ">
                <div className="w-8 h-8 border-4 border-gray-200  border-t-transparent rounded-full animate-spin">

                </div>
              </div>: 'submit'} </motion.button>
            </div>
          </motion.form>

        </motion.div>

      </div>
    </div>
  )
}

export default AddPost
