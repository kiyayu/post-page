import Categories from "../models/categories.js";

const predefinedCategories = [
  "Technology",
  "Health",
  "Lifestyle",
  "Education",
  "Entertainment",
];
 
const seedCategories = async () => {
  try {
    for (const categoryName of predefinedCategories) {
      await Categories.updateOne(
        { name: categoryName },
        { $setOnInsert: { name: categoryName } },
        { upsert: true } // Insert if not already present
      );
    }
    
   // Close the database connection
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
export const getCategories = async (req, res) => {
  try {
    const categories = await Categories.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}; 