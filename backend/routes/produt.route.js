import express from 'express';
import { AddProducts, DeleteProduct, GetAllProducts, GetMyProducts, GetSingleProduct, searchProducts, UpdateProducts } from '../controllers/produt.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';


const router = express.Router();


router.post('/add-products',isAuth, upload.single("image"), AddProducts);
router.patch('/update-product/:id', isAuth, upload.single("image"), UpdateProducts);
router.get("/single-product/:id",isAuth, GetSingleProduct)
router.get("/get-all", GetAllProducts)
router.get("/get-my-products",isAuth, GetMyProducts)
router.delete("/delete-product/:id",isAuth, DeleteProduct)
router.post("/search",isAuth, searchProducts)

export default router;