import mongoose from "mongoose";

const schema = new mongoose.Schema({
  brandName: String
})

export default mongoose.model("DeviceBrand", schema)