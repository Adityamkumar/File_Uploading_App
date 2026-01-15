import ImageKit from "imagekit";
import { configDotenv } from "dotenv";
configDotenv()

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


const uploadFile = async (file, fileName) => {
  const result = await imagekit.upload({
    file: file,
    fileName: fileName,
  });

  return result;
};

export{uploadFile, imagekit}