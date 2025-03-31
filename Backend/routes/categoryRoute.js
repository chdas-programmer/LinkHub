import express from "express";
import { createCategory, getCategories }  from  "../controllers/categoryController.js";
import { authorizeAdmin,authenticate } from "../middlewares/authMiddleware.js";


const router=express.Router();

router.route("/createCategory").post(authenticate,createCategory);
router.route("/getCategories").get(authenticate,getCategories);
//
// router.route("/getLink/:id").get(authenticate,getLinkById);
// router.route("/updateLink/:id").put(authenticate,authorizeAdmin,updateLinkById);
// router.route("/deleteLink/:id").delete(authenticate,authorizeAdmin,deleteLinkById);
// router.route("/verifyLink/:id").post(authenticate,verifyLink);



export default router;