import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },
    isPublic:{
      type: Boolean,
      default: false
    },
    shareToken:{
       type: String,
       default: null
    }
  },
  {
    timestamps: true,
  }
);

const fileModel = mongoose.model("file", fileSchema);
export default fileModel;
