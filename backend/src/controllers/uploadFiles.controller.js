

export const fileUpload = async (req, res) => {
    const file = req.file

    try {
          if(!file){
        return res.status(400).json({
            message: "file is required !"
        })
    }

    console.log("File Recieved:")
    console.log("Name:", file.originalname)
    console.log("Type:", file.mimetype)
    console.log("Size:", file.size)

     return res.status(200).json({
      message: "File uploaded successfully",
      file: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      },
    });

    } catch (error) {
        return res.status(500).json({
            message: "file upload falied"
        })
    }

}