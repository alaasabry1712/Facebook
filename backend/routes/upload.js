const express = require("express");
const { uploadImages, listImages } = require("../controllers/upload");
const { authUser } = require("../middlewares/auth");
const imageUpload = require("../middlewares/imageUpload");

const router = express.Router(); // Create an Express Router

// Route for uploading images
router.post("/uploadImages", authUser, imageUpload, uploadImages);
// - When a POST request is made to "/uploadImages", it will go through the following middlewares:
//   1. authUser: This middleware checks if the user is authenticated.
//   2. imageUpload: This middleware handles the image upload process.
// - After passing through these middlewares, it will execute the "uploadImages" function from the "upload" controller.

// Route for listing images
router.post("/listImages", authUser, listImages);
// - When a POST request is made to "/listImages", it will go through the following middlewares:
//   1. authUser: This middleware checks if the user is authenticated.
// - After passing through the middleware, it will execute the "listImages" function from the "upload" controller.

module.exports = router;
