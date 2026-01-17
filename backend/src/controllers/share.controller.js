import fileModel from "../models/file.model.js";
import crypto from 'crypto'

export const shareFileLink = async (req, res) => {
  const {id} = req.params;
  const user = req.user._id;

  try {
    const file = await fileModel.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (file.user.toString() !== user.toString()) {
      return res.status(403).json({ message: "You are not allowed to share this file" });
    }

    //reuse token if already shared
    if (file.isPublic && file.shareToken) {
      return res.status(200).json({
        message: "File already shared",
        shareUrl: `${process.env.BACKEND_URL}/api/share/${file.shareToken}`,
      });
    }

    //new Sharetoken
    const token = crypto.randomUUID();

    file.isPublic = true;
    file.shareToken = token;
    await file.save();

    return res.status(200).json({
      message: "File Shared Successfully",
      shareUrl: `${process.env.BACKEND_URL}/api/share/${token}`,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Failed to generate share link",
    });
  }
};