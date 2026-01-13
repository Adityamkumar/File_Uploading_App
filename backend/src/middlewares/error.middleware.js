import multer from "multer";

export const globalErrorHandler = (err, req, res, next) =>{
     if(err instanceof multer.MulterError){
         if(err.code === "LIMIT_FILE_SIZE"){
            return res.status(400).json({
                message: "File size exceeds 10MB limit"
            })
         }
     }

     if(err.isFileTypeError){
        return res.status(400).json({
            message: err.message
        })
     }

     return res.status(500).json({
        message: "Internal server error"
     })
}