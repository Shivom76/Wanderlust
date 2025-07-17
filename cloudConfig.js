const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env["CLOUD-NAME"],
    api_key:process.env["CLOUD-API-KEY"],
    api_secret:process.env["CLOUD-API-SECRET"]
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats:["png","jpg","jpeg"],
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });

module.exports={
    cloudinary,
    storage
}