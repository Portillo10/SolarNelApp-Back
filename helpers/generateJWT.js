// const jwt = require("jsonwebtoken");
// const UserModel = require("../models/User.model");
import jwt from 'jsonwebtoken'

export const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, process.env.SECRETORPRIVATEKEY, (err, token) => {
      if (err) {
        console.log(err);
        reject("Can't generate token");
      } else {
        resolve(token);
      }
    });
  });
};

const validateSocketJWT = async (token) => {
  try {
    if (token.length < 10) {
      throw new Error("Token mandatory");
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await UserModel.findByPk(uid);

    if (!user) {
      throw new Error("User doesn't exist");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
};