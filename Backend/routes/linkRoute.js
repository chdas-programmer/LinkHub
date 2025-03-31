import express from "express";
import { createLink, getApprovedLinks,getLinks, getLinkById, updateLinkById, deleteLinkById, verifyLink } from "../controllers/linkController.js";
import { authorizeAdmin,authenticate } from "../middlewares/authMiddleware.js";


const router=express.Router();

router.route("/createLink").post(authenticate,createLink);
router.route("/getApprovedLinks").get(getApprovedLinks);
router.route("/getLinks").get(authenticate,authorizeAdmin,getLinks);
router.route("/getLink/:id").get(authenticate,getLinkById);
router.route("/updateLink/:id").put(authenticate,authorizeAdmin,updateLinkById);
router.route("/deleteLink/:id").delete(authenticate,authorizeAdmin,deleteLinkById);
router.route("/verifyLink/:id").post(authenticate,verifyLink);



export default router;