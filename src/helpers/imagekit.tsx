import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUB || "",
  privateKey: process.env.IMAGEKIT_PRIV || "",
  urlEndpoint: "https://ik.imagekit.io/vyfilo2gd",
});

export const uploadImage = async (file: any, path: string, name: string) => {
  try {
    const response = await imagekit.upload({
      file: file,
      folder: path,
      fileName: name,
      overwriteFile: true,
      useUniqueFileName: false,
    });
    console.log("Upload success", response.url);
    return true;
  } catch (error) {
    console.log("Upload failed", error);
    return false;
  }
};
