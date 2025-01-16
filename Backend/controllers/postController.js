import Post from "../models/post.js";
import mongoose from 'mongoose'
import Categories from  '../models/categories.js'
import { User } from '../models/user.js'
import Notification from "../models/Notification.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, categories } = req.body;
    const userId = req.user.id;
    const file = req.file ? req.file.path : null;

    // Ensure categories is an array
    const categoriesArray = Array.isArray(categories)
      ? categories
      : [categories];

    const post = new Post({
      title,
      content,
      categories: categoriesArray,
      author: userId,
      file,
    });

    await post.save();

    // Check if notifications already exist for the post
    const existingNotifications = await Notification.find({
      postId: post._id,
      notificationType: "new_post",
    });

    if (existingNotifications.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Notifications already sent." });
    }

    // Fetch all users except the author
    const users = await User.find({ _id: { $ne: userId } });

    // Prepare notifications for all users
    const notifications = users.map((user) => ({
      title: post.title,
      author: post.author,
      postId: post._id,
      file: post.file,
      notificationType: "new_post",
      recipient: user._id, // Notification recipient is each user
    }));

    // Insert all notifications at once
    await Notification.insertMany(notifications);

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const getpost = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 5,
      sortBy = 'createdAt',
      order = 'desc',
      category = '',
      search = '',
      title = '',
      popular = '',
      postId = '',
    } = req.query;

    const currentPage = Math.max(1, parseInt(page));
    const itemsPerPage = Math.max(1, parseInt(perPage));
    const skip = itemsPerPage * (currentPage - 1);

    const userId = req.user.id;

    let categoryId = null;
    if (category) {
      const categoryDoc = await Categories.findOne({ name: { $regex: category, $options: 'i' } });
      if (categoryDoc) {
        categoryId = categoryDoc._id;
      }
    }

const matchStage = {
  ...(categoryId ? { categories: categoryId } : {}),
  ...(search ? { title: { $regex: search, $options: "i" } } : {}),
  ...(title ? { title: { $regex: title, $options: "i" } } : {}),
  ...(popular ? { title: { $regex: popular, $options: "i" } } : {}),
  ...(postId && mongoose.isValidObjectId(postId)
    ? { _id: new mongoose.Types.ObjectId(postId) }
    : {}),
};



  const posts = await Post.aggregate([
    { $match: matchStage }, // Filters posts based on the matchStage criteria
    {
      $addFields: {
        likeCount: { $size: "$likes" }, // Add a like count
        commentCount: { $size: "$comments" }, // add comment count
        isUserPost: {
          $cond: {
            if: { $eq: ["$author", new mongoose.Types.ObjectId(userId)] },
            then: 1,
            else: 0,
          },
        },
      },
    },

    {
      $sort: {
        isUserPost: -1, // Prioritize user's own posts
        likeCount: order === "asc" ? 1 : -1,
        [sortBy]: order === "asc" ? 1 : -1,
      },
    },
    { $skip: skip },
    { $limit: itemsPerPage },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      },
    },
    {
      $lookup: {
        from: "users", // Populate user details for comments
        localField: "comments.userId",
        foreignField: "_id",
        as: "comments.userDetails",
      },
    },
    {
      $unwind: {
        path: "$comments",
        preserveNullAndEmptyArrays: true, // Ensure posts without comments are not excluded
      },
    },
    {
      $lookup: {
        from: "users", // Populate user details for replies
        localField: "comments.replies.userId",
        foreignField: "_id",
        as: "comments.replies.userDetails",
      },
    },
    {
      $group: {
        _id: "$_id", // Re-group posts after unwinding comments
        title: { $first: "$title" },
        content: { $first: "$content" },
        file: { $first: "$file" },
        likeCount: { $first: "$likeCount" },
        commentCount: { $first: "$commentCount" },
        categories: { $first: "$categories" },
        author: { $first: "$author" },
        createdAt: { $first: "$createdAt" },
        comments: { $push: "$comments" }, // Group comments back into an array
      },
    },
    {
      $project: {
        title: 1,
        content: 1,
        file: 1,
        likeCount: 1,
        createdAt: 1,
        commentCount: 1,
        "author._id": 1,
        "author.name": 1,
        "author.profile": 1,
        comments: {
          userId: 1,
          commentText: 1,
          likes: { $size: "$comments.likes" }, // Calculate comment likes
          createdAt: 1,
          updatedAt: 1,
          replies: {
            userId: 1,
            replyText: 1,
            likes: { $size: "$comments.replies.likes" }, // Calculate reply likes
            createdAt: 1,
            updatedAt: 1,
          },
        },
        categories: 1,
      },
    },
  ]);

    const totalPosts = await Post.countDocuments(matchStage);
    const totalPages = Math.ceil(totalPosts / itemsPerPage);
 
    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
      pagination: { currentPage, itemsPerPage, totalPages, totalPosts },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "An error occurred while fetching posts", error });
  }
};

// get popular post 
export const getPopularPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
        },
      },
      { $sort: { likeCount: -1, commentCount: -1 } }, // Sort by most likes and comments
      { $limit: 5 }, // Limit to top 5 popular posts
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ]);

    res.status(200).json({
      message: "Popular posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching popular posts",
        error,
      });
  }
};

 // get user post
export const getUserPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const userPosts = await Post.aggregate([
      {
        $match: { author: new mongoose.Types.ObjectId(id) }, // Convert id to ObjectId
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          file: 1,
          createdAt: 1,
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
          "author._id": 1,
          "author.name": 1,
          "author.profile": 1,
          categories: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (!userPosts || userPosts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json({
      success: true,
      posts: userPosts,
    });
  } catch (error) {
    console.error("Error in getUserPost:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user posts",
      error: error.message,
    });
  }
};

// get post byId 
export const getPostById = async(req, res) =>{
  try{
    const {postId} = req.params
    const post = await Post.findById(postId)
   
    res.json(post)
  }
  catch (error) {
    console.log("error", error)
  }
}

// update post
export const updatePost = async (req, res) => {
  try {
    const { title, content, categories } = req.body;
    const { postId } = req.params;
    const file = req.file ? req.file.path : null;

    // Build the update object dynamically
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (file) updateData.file = file;
    if (categories) updateData.categories = categories
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No update data provided" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // Assuming user ID is readily available in req.user

    // Perform efficient authorization check using findOne with projection
    const postToDelete = await Post.findOne({ _id: postId }, { author: true });
    if (
      !postToDelete ||
      postToDelete.author.toString().toLowerCase() !== userId.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
    }
  
    // Authorized deletion: Use findByIdAndDelete for efficiency
    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post successfully deleted." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the post." }); // Handle errors gracefully
  }
};



//crate comment
export const createComment = async (req, res) => {
  try {
    

    const { commentText } = req.body;
    const { postId } = req.params;
 

    if (!commentText || !postId) {
      return res.status(400).json({
        message: "All input required",
        received: { commentText, postId },
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId,
      commentText,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, perPage = 3 } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },
      {
        $project: {
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                commentText: "$$comment.commentText",
                userId: "$$comment.userId",
                likes: "$$comment.likes",
                replies: {
                  $map: {
                    input: "$$comment.replies",
                    as: "reply",
                    in: {
                      _id: "$$reply._id",
                      replyText: "$$reply.replyText",
                      userId: "$$reply.userId",
                      likes: "$$reply.likes",
                      createdAt: "$$reply.createdAt",
                    },
                  },
                },
                createdAt: "$$comment.createdAt",
              },
            },
          },
        },
      },
      { $unwind: "$comments" },
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $addFields: {
          "comments.userId": { $arrayElemAt: ["$userInfo", 0] },
        },
      },
      {
        $addFields: {
          "comments.replies": {
            $map: {
              input: "$comments.replies",
              as: "reply",
              in: {
                $mergeObjects: [
                  "$$reply",
                  {
                    likesCount: { $size: "$$reply.likes" },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          let: { replies: "$comments.replies" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$replies.userId"],
                },
              },
            },
          ],
          as: "replyUsers",
        },
      },
      {
        $addFields: {
          "comments.replies": {
            $map: {
              input: "$comments.replies",
              as: "reply",
              in: {
                $mergeObjects: [
                  "$$reply",
                  {
                    userId: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$replyUsers",
                            cond: { $eq: ["$$this._id", "$$reply.userId"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: "$comments._id",
          commentText: "$comments.commentText",
          userId: {
            _id: "$comments.userId._id",
            name: "$comments.userId.name",
            profile: "$comments.userId.profile",
          },
          likes: "$comments.likes",
          replies: {
            $map: {
              input: "$comments.replies",
              as: "reply",
              in: {
                _id: "$$reply._id",
                replyText: "$$reply.replyText",
                userId: {
                  _id: "$$reply.userId._id",
                  name: "$$reply.userId.name",
                  profile: "$$reply.userId.profile",
                },
                likes: "$$reply.likes",
                likesCount: "$$reply.likesCount",
                createdAt: "$$reply.createdAt",
              },
            },
          },
          createdAt: "$comments.createdAt",
          likesCount: { $size: "$comments.likes" },
        },
      },
    ]);

    // Get total comments count for pagination
    const totalComments = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },
      { $project: { commentCount: { $size: "$comments" } } },
    ]);

    const total = totalComments[0]?.commentCount || 0;
    const totalPages = Math.ceil(total / perPage);

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments: post,
      pagination: {
        currentPage: parseInt(page),
        perPage: parseInt(perPage),
        totalComments: total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { commentUpdatedText } = req.body;

    const userId = req.user?.id; // Getting the authenticated user's ID
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!postId || !commentId || !commentUpdatedText) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post Not Found" });
    }

    // Find the comment in the post's comments array
    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) {
      return res.status(400).json({ message: "Comment Not Found" });
    }

    // Update the comment's text and the updatedAt timestamp
     if (comment.commentText !== commentUpdatedText) {
      comment.commentText = commentUpdatedText;
      comment.updatedAt = Date.now(); // Only update updatedAt if the text changes
     }
    // Save the post with the updated comment
    await post.save();

    // Return the updated comment in the response
    res
      .status(200)
      .json({
        message: "Comment updated successfully",
        updatedComment: comment,
      });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const userId = req.user?.id; // Authenticated user's ID
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post Not Found" });
    }

    // Find the comment to be deleted
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(400).json({ message: "Comment Not Found" });
    }

    // Ensure the user owns the comment
    const comment = post.comments[commentIndex];
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: Not your comment" });
    }

    // Remove the comment from the comments array
    post.comments.splice(commentIndex, 1);

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createReply = async (req, res) => {
  try {
    const { replyText } = req.body;
    const { postId, commentId } = req.params;
    if (!replyText || !postId || !commentId) {
      return res.status(400).json({
        message: "All input required",
        received: { replyText, postId, commentId },
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newReply = {
      userId,
      replyText,
      createdAt: new Date(),
    };

    comment.replies.push(newReply);
    await post.save();

    return res.status(201).json({
      message: "Reply added successfully",
      reply: newReply,
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};


// update reply

export const updateReplay = async(req, res) =>{
  try{
    const {postId, commentId, replyId,} = req.params
    const { replyText } = req.body

    if(!postId || !commentId || !replyId || !replyText){
      return res.status(400).json({message:"All Input required", received:{postId, commentId, replyId, replyText}})
    }
    

   const userId = req.user.id
   if(!userId){
    return res.status(401).json({message:"UnAuthorized"})
   }
   
   const post = await Post.findById(postId)
   if(!post){
    return res.status(404).json({message:"Post Not Found"})
   }

  const comment = post.comments.find((comment) => comment.id === commentId)
  if(!comment) {
    return res.status(404).json({message:"Comment Not Found"})
  }
   
  const reply = comment.replies.find(
    (reply) => reply._id.toString() === replyId
  );

  
  if(reply.replyText !== replyText){
    reply.replyText = replyText
    
  }
  await post.save()
 
return res.status(201).json({message:"reply updated", updatedReply:post.comments.replies})

  }
  catch (error){
    console.log("error", error)
    return res.status(500).json({message:"An error occured ",error:error.message })
  }
}


// delete reply 
export const deleteReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;

    if (!postId || !commentId || !replyId) {
      return res.status(400).json({
        message: "All Input required",
        received: { postId, commentId, replyId },
      });
    }

    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "UnAuthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment Not Found" });
    }

    const replyIndex = comment.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );
    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply Not Found" });
    }

    // Remove the reply
    comment.replies.splice(replyIndex, 1);

    // Save the updated post
    await post.save();

    return res.status(200).json({ message: "Reply successfully deleted" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};


export const toggleLike = async (req, res) =>{
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
 
    const likedIndex = post.likes.indexOf(userId);
    if (likedIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likedIndex, 1);
    }
    await post.save();
    return res.status(200).json({
      message: likedIndex === -1 ? "Post liked" : "Post unliked",
      likesCount: post.likes.length, // Return the updated likes count
      likedByUser: likedIndex === -1, // Whether the user currently likes the post
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// comment likes
export const toggleCommentLike = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    if (!postId || !commentId) {
      return res.status(400).json({
        message: "All input required",
        received: { postId, commentId },
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment Not Found" });
    }

    const commentLikeIndexOf = comment.likes.indexOf(userId);
    if (commentLikeIndexOf === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(commentLikeIndexOf, 1);
    }

    await post.save();
    res.status(200).json({
      message: "Comment like toggled",
      likes: comment.likes,
      likeCount: comment.likes.length,
    });
  } catch (error) {
    console.error("Error Toggling Comment Like:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// reply likes
export const toggleReplyLike = async (req, res)=>{
  try{
    const {postId, commentId, replyId} = req.params
    const userId = req.user.id
    if(!postId || !commentId || !replyId){
      return res.status(400).json({message:"All input required", received:{postId, commentId, replyId}})
    }
    
    const post = await Post.findById(postId)
    if(!post){
      return res.status(404).json({message:"Post Not Found"})
    }

    const comment = post.comments.find((comment) => comment._id.toString() === commentId)
    if(!comment){
      return res.status(404).json({message:"Comment Not Found"})
    }

    const reply = comment.replies.find((reply) => reply._id.toString() === replyId)
    if(!reply){
      return res.status(404).json({message:"Reply Not Found"})
    }
    
    const replyLikesIndexOf = reply.likes.indexOf(userId)
    if(replyLikesIndexOf === -1){
      reply.likes.push(userId)
    } else{
      reply.likes.splice(replyLikesIndexOf, 1)
    }
    await post.save()
    res.status(200).json({message:"reply liked", likes:reply.likes, likeCount: reply.likes.length})

  } catch (error){
    console.error("Error Toggling Reply like", error)
    res.status(500).json({message:"Internal server error"})
  }
}