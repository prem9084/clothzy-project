import express from 'express';
import { getUserById, loginUser, logoutUser, registerUser, updateProfile } from '../controllers/user.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/logout",isAuth,logoutUser)
router.get("/get-user/:id",isAuth,getUserById)
router.patch("/update-user/:id",isAuth,upload.single("image"), updateProfile)

router.get('/me', isAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;