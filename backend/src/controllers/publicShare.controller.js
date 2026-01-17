import fileModel from "../models/file.model.js"

export const openSharedFile = async (req, res) => {
    const { token } = req.params

    try {
         const file = await fileModel.findOne({
        shareToken: token,
        isPublic: true
    })

     if(!file){
        res.status(404).json({
           message: "Invalid or expired link"
        })
     }

     return res.redirect(file.fileUrl)
    } catch (error) {
      return res.status(500).json({
         message: "Failed to open file"
      })
    }
}