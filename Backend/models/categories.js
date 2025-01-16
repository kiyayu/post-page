import mongoose from 'mongoose'

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate category names
  },
});
const Categories = mongoose.model("Categories", categoriesSchema)
export default Categories   