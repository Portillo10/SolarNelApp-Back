import mongoose from "mongoose";

const replacementTypeSchema = new mongoose.Schema({
  typeDesc: String,
  replacementProps: Array
})

export default mongoose.model("ReplacementType", replacementTypeSchema)