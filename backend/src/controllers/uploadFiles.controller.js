import path from "path";
import { uploadFile } from "../services/storage.service.js";
import fileModel from "../models/file.model.js";
import { imagekit } from "../services/storage.service.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const fileUpload = async (req, res) => {
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({
        message: "file is required !",
      });
    }
    const ext = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${ext}`;

    const uploadedFile = await uploadFile(
      fs.createReadStream(file.path),
      uniqueFileName
    );

    if (file?.path) {
      fs.unlinkSync(file.path);
    }

    const savedFile = await fileModel.create({
      user: req.user._id,
      originalName: file.originalname,
      fileUrl: uploadedFile.url,
      fileId: uploadedFile.fileId,
      type: file.mimetype,
      size: file.size,
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "file upload failed",
      error: error.message,
    });
  }
};

export const getFiles = async (req, res) => {
  const userId = req.user._id;

  try {
    const file = await fileModel.find({ user: userId }).sort({ createdAt: -1 }); //latest files first

    return res.status(200).json({
      message: "Successfully fetched all files",
      files: file,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch files",
    });
  }
};

export const deleteFiles = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;

  try {
    const file = await fileModel.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (file.user.toString() !== user.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await imagekit.deleteFile(file.fileId);
    await fileModel.deleteOne({ _id: file._id });

    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Failed to delete file",
    });
  }
};


