import express from "express";

import { userLogin, userRegister } from "../controller/userController.js";

const route=express.Router();


route.post("/registerUser",userRegister);

route.post("/LoginUser",userLogin);


export default route;
