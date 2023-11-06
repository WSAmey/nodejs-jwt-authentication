import user from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
const SECRET_KEY="API123";

// dotenv.config();
// const SECRET_KEY=process.dotenv.Secret_Key

export const userRegister=async (req,res)=>{
   
        //Existing User Check
        //Hashed Password- password is not directly saved in database in form of plaintext, it is first encrypted or hashed then we save in database so that even if our database is hacked then he should get exact password 

        //User Creation
        //Token Generate
      const {username,email,password}= req.body;
      try {
        const existingUser=await user.findOne({email:email})

        if(existingUser){

            return res.status(400).json({message:"User already exists"}) //status 400 is used for bad request that means the user you have requested is already exists in database

        }

        const hashedPassword = await bcrypt.hash(password,10);
        const result=await user.create({
            email: email,
            password:hashedPassword,
            username:username
        })

        const token=jwt.sign({email:result.email, id: result._id},SECRET_KEY )
        res.status(201).json({user:result,token:token})


      } 
      catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong"})
      }
    
}

export const userLogin=async (req,res)=>{
    const {email,password}=req.body;
   try {
       
       const existingUser=await user.findOne({email:email})
    
       if(!existingUser){

        return res.status(404).json({message:"User not found"}) //status 400 is used for bad request that means the user you have requested is already exists in database

    }
        const matchPassword=await bcrypt.compare(password,existingUser.password)//compare normal password(sent by user on request) with hashed password (existingUser.password)

        if(!matchPassword){
            res.status(400).json({message:"Invalid Credentials"});
        }

        const token=jwt.sign({email:existingUser.email, id: existingUser._id},SECRET_KEY)
        res.status(201).json({user:existingUser,token:token})

   } catch (error) {
    console.log(error);
    res.status(500).json({message:"Something went wrong"})
    }
    
}

