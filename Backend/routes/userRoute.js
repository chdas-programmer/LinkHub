import express from "express";
import { getCurrentUserById,loginUser,createUser,verifyUser,logoutCurrentUser,getAllUser,getCurrentUserProfile,updateUserById ,deleteUserById } from "../controllers/userController.js";
import { authorizeAdmin,authenticate } from "../middlewares/authMiddleware.js";
import verifyToken from "../middlewares/verifyId.js";

const router=express.Router();

router.route("/createUser").post(createUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").post(logoutCurrentUser);
router.route("/getAllUser").get(authenticate,authorizeAdmin,getAllUser);
router.route("/verifyAdmin/:id").post(authenticate,authorizeAdmin,verifyUser);

router.route("/updateUser/:id").put(updateUserById);
router.route("/deleteUser/:id").delete(deleteUserById);


router.route("/ById/:id").get(getCurrentUserById);
router.route("/profile").get(authenticate,verifyToken,getCurrentUserProfile);


export default router;