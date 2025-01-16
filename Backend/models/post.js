import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";

// Define character limits
const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 5000;
const COMMENT_MAX_LENGTH = 1000;
const REPLY_MAX_LENGTH = 500;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: TITLE_MAX_LENGTH,
      trim: true,
      set: (title) => sanitizeHtml(title), // Sanitizing title
    },
    content: {
      type: String,
      required: true,
      maxlength: CONTENT_MAX_LENGTH,
      set: (content) => sanitizeHtml(content), // Sanitizing content
    },
    file: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        commentText: {
          type: String,
          required: true,
          maxlength: COMMENT_MAX_LENGTH,
          set: (text) => sanitizeHtml(text), // Sanitizing comment text
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        replies: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            replyText: {
              type: String,
              required: true,
              maxlength: REPLY_MAX_LENGTH,
              set: (text) => sanitizeHtml(text), // Sanitizing reply text
            },
            likes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            ],
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook for additional data validation or sanitization if needed
postSchema.pre("save", function (next) {
  if (this.content) this.content = sanitizeHtml(this.content);
  if (this.title) this.title = sanitizeHtml(this.title);
  next();
});

// Create the model
const Post = mongoose.model("Post", postSchema);

export default Post;
 