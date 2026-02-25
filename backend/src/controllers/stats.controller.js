import File from "../models/file.model.js"

export const getUserStorageStats = async (req, res) => {
    try {
        const userId = req.user ?. _id

        if (! userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const [stats] = await File.aggregate([
            {
                $match: {
                    user: userId
                }
            }, {
                $group: {
                    _id: userId,
                    totalFiles: {
                        $sum: 1
                    },
                    totalStorage: {
                        $sum: "$size"
                    },
                    lastUpload: {
                        $max: "$createdAt"
                    }
                }
            }, {
                $project: {
                    userId: "$_id",
                    totalFiles: 1,
                    totalStorage: 1,
                    lastUpload: 1
                }
            }
        ])

        const finalStats = stats || {
            totalFiles: 0,
            totalStorage: 0,
            lastUpload: null
        };
        return res.status(200).json({message: "storage fetched successfully", data: finalStats})
    } catch (error) {
        console.error("Stats Error:", error);
        return res.status(500).json({message: "Server Error"});
    }
}
