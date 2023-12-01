import mongoose from "mongoose";

const replacementTypeSchema = new mongoose.Schema({
  typeDesc: {type:String, lowercase:true},
  replacementProps: [
    {
      prop:{type:String, lowercase:true},
      symbol:{
      type:String,
      uppercase: true
    }}
  ]
})

export default mongoose.model("ReplacementType", replacementTypeSchema)