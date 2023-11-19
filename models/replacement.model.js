import mongoose from "mongoose";

const replacementSchema = new mongoose.Schema({
  replacementType: String,
  props: Object,
  price: Number,
});

export default mongoose.model("Replacement", replacementSchema);
