import mongoose from "mongoose";

const replacementSchema = new mongoose.Schema({
  replacementType: {type:String, lowercase:true},
  props: Object,
  price: Number,
});

export default mongoose.model("Replacement", replacementSchema);
