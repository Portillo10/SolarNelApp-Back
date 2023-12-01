import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: {
    type:String,
    require:true,
    lowercase: true
  },
  password: {
    type:String,
    require:true
  },
  firstname: {
    type:String,
    require: true,
    lowercase: true
  },
  lastname:{
    type:String,
    require: true,
    lowercase: true
  },
  // enable: {
  //   type: Boolean,
  //   default: true
  // },
  // phone: Number,
  // rol: {
  //   type: String,
  //   enum: ["ADMIN", "EMPLOYEE"]
  // },
  // documentNumber: { type: Number, require: true },
})

export default mongoose.model("User", schema)