import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  numberCode: Number,
  deviceType: {
    type: String,
    required: true,
  },
  customerName: String,
  customerPhone: Number,
  brand: { type: String },
  deviceProps: {
    type: Object,
    required: true,
  },
  state: {
    type: String,
    lowercase:true,
    required: true,
    default: "recibido",
  },
  history: [
    {
      replacements: [
        {
          replacementId: {
            type: mongoose.Types.ObjectId,
            ref: "Replacement",
            required: true,
          },
          quantity: Number,
        },
      ],
      repairDate: {
        type: Date,
        default: new Date(),
      },
      author: {
        required:true,
        type: mongoose.Types.ObjectId,
        ref:"User"
      },
      observations: String,
      repairPrice: Number
    },
  ],
  lastRepairPrice: { type: Number, default: 0 },
});

export default mongoose.model("Device", deviceSchema);
