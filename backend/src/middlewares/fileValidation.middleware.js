export const fileFilter = (req, file, cb) => {
  const allowedMimeTypesRegex =
    /^(image\/(jpeg|jpg|png|webp|avif)|application\/pdf)$/;

  if (allowedMimeTypesRegex.test(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    const error = new Error("Only images (jpeg, png, webp, avif) and PDFs are allowed");
    error.isFileTypeError = true;
    cb(error)
  }
};
