import { uploadImage } from "../db/cloudinary.js";
import produtModel from "../models/produt.model.js";

export const AddProducts = async (req, res) => {
  try {
    const { title, price, description, category, stock } = req.body;
    const image = req.file?.path; // Assuming the image is uploaded via multer and available in req.file

    // validation
    switch (true) {
      case !title:
        return res.json({ message: "Title is required" });

      case !price:
        return res.json({ message: "Price is required" });

      case !description:
        return res.json({ message: "Description is required" });

      case !category:
        return res.json({ message: "Category is required" });

      case !stock:
        return res.json({ message: "Stock is required" });

      case !image:
        return res.json({ message: "Image is required" });

      default:
        // All fields are valid; continue processing
        break;
    }

    const imageUrl = await uploadImage(image);

    // create product
    const product = await produtModel.create({
      title,
      price,
      description,
      image: imageUrl.secure_url,
      category,
      stock,
      createdBy: req.user._id, // Assuming you have user authentication and req.user is set
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

export const UpdateProducts = async (req, res) => {
  try {
    const { title, price, description, category, stock } = req.body;

    const updateData = {
      title,
      price,
      description,
      category,
      stock,
    };

    // Only update image if a new one was uploaded
    if (req.file) {
      const imageUrl = await uploadImage(req.file.path);
      updateData.image = imageUrl.secure_url;
    }

    const product = await produtModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};


// get single product
export const GetSingleProduct = async (req, res) => {
  try {
    const product = await produtModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// get all products
export const GetAllProducts = async (req, res) => {
  try {
    const products = await produtModel.find({});

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};
// get my products
    export const GetMyProducts = async (req, res) => {
      const id = req.user._id || req.user
      try {
        const products = await produtModel.find({createdBy:id});

        res.status(200).json({
          success: true,
          products,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error fetching products", error: error.message });
      }
    };

// delete product
export const DeleteProduct = async (req, res) => {
  try {
    const product = await produtModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// search product
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Perform case-insensitive partial match
    const regex = new RegExp(query, "i");

    const products = await produtModel.find({ title: { $regex: regex } });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server error while searching products" });
  }
};
