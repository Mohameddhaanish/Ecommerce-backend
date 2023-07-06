const express = require("express");
const router = express.Router();
const { Product } = require("../model/product");
const { Category } = require("../model/category");
//UPLOAD FILES
const multer = require("multer");
const file_mimetype = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = file_mimetype[file.mimetype];
    console.log(file);
    let validationError = new Error("file type is not supported");
    if (isValid) {
      validationError = null;
    }
    cb(validationError, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const finlename = file.originalname;
    const extension = file_mimetype[file.mimetype];
    cb(null, `${finlename}-${Date.now()}.${extension}`);
  },
});
const fileSize = 2 * 1000 * 1000;
const upload = multer({ storage: storage, limits: fileSize });

//CREATE NEW PRODUCT
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const files = req.file;
    if (!files) {
      res.status(400).send({ Message: "No image is attached" });
    }
    const filename = files.filename;

    const createProducts = await Product.create({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${req.protocol}//${req.get("host")}/public/uploads/${filename}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    });
    res.send(createProducts);
  } catch (err) {
    res.status(400).send({ err: err.message, success: false });
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name -_id");
    // const products = await Product.sayHi("Mama Earth");
    // console.log(products);
    if (!products) {
      res.status(500).send({ success: false });
    }
    res.json({ Produts: products });
  } catch (err) {
    res.status(400).send({ err: err.message, success: false });
  }
});

//GET SPECIFIC PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id).populate(
      "category",
      "name -_id"
    );

    if (!products) {
      res.status(404).send({ success: false, message: "Id not found" });
    }
    res.send(products);
  } catch (err) {
    res.status(400).send({ err: err.message, success: false });
  }
});

//UPDATE PRODUCT
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const findProduct = Product.findById(req.params.id);
    if (!findProduct) {
      res.status(404).send("Invalid product!");
    }
    const file = req.file;
    let imagepath;
    if (file) {
      const filename = file.filename;
      const basepath = `${req.protocol}://${req.get(
        "host"
      )}/public/uploads/${filename}`;
      imagepath = basepath;
    } else {
      imagepath = findProduct.image;
    }

    const products = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagepath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );
    if (!products) {
      res.status(500).send({ success: false });
    }
    res.send(products);
  } catch (err) {
    res.status(400).send({ err: err.message, success: false });
  }
});

//DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const deleteproduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteproduct) {
      res.status(404).send({ success: false, message: "Id not found" });
    } else {
      res.status(200).send({
        success: true,
        message: "The product is deleted successfully!",
      });
    }
  } catch (err) {
    res.status(400).send({ Error: err.message, success: false });
  }
});

//GET TOTAL COUNT FOT ANALYTIC PURPOSE
router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(400).send("invalid");
  }
  res.status(200).send({ count: productCount });
});

//GET CATEGORY BY QUERY IN URL PATH
router.get("/get/category", async (req, res) => {
  let filter = {};
  if (req.query.name) {
    filter = { name: req.query.name.split(",") };
  }
  console.log(filter);
  const products = await Product.find(filter);
  res.send(products);
});

//UPDATE  GALLERY-IMAGES
router.put("/gallery/:id", upload.array("images", 10), async (req, res) => {
  try {
    const findProduct = await Product.findById(req.params.id);
    if (!findProduct) {
      res.status(404).send({ success: false, message: "Invalid product" });
    }
    const files = req.files;
    let imagespaths = [];
    const basepath = `${req.protocol}://${req.get("host")}/public/uploads`;
    if (files) {
      console.log(files);
      files.map((file) => {
        imagespaths.push(`${basepath}/${file.filename}`);
      });
    }
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagespaths,
      },
      { new: true }
    );
    res.status(200).send(updateProduct);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
module.exports = router;
