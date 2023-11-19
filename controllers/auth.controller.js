import { request, response } from "express";
import { generateJWT } from "../helpers/generateJWT.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const login = async (req = request, res = response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "missing username or password" });
  }
  try {
    const user = await userModel.findOne({ username });

    if (!user) return res.status(400).json({ msg: "Username doesn't exist" });

    const correctPassword = bcrypt.compareSync(password, user.password)

    if(!correctPassword) return res.status(400).json({msg:"wrong credentials"})

    const token = await generateJWT(user._id);

    
    res.cookie("token", token);
    
    const { password:pass, ...userData } = user._doc;
    
    res.status(200).json({
      ...userData
    });
  } catch (error) {}
};

export const register = async (req, res) => {
  const { userInfo } = req.body;
  try {
    const userExist = await userModel.findOne({
      documentNumber: userInfo.documentNumber,
    });

    if (userExist) return res.status(204).json({ msg: "User exist" });
    const salt = bcrypt.genSaltSync();

    userInfo.password = bcrypt.hashSync(userInfo.password, salt);

    const newUser = new userModel(userInfo);

    await newUser.save();

    return res.status(200).json({
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const getCookie = (req, res) => {
  res.cookie("token", "sepuede")
  res.send("sisas")
}