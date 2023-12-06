import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'


export const validateJWT = async (req, res, next) => {
  
  const {token} = req.body;

  if (!token) {
    return res.status(401).json({
      msg: "Token mandatory",
    });
  }

  try {
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await userModel.findById(uid)

    if (!user){
      throw new Error("Can't find user id")
    }

    const {password, ...userData} = user._doc

    req.user = userData

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Invalid token",
    });
  }
};