export const getStorageStats = async () => {
    try {
        const response = await api.get("/api/stats/storage");
        return response.data;
    } catch (error) {
        console.error("Error fetching storage stats:", error);
        throw error;
    }
};