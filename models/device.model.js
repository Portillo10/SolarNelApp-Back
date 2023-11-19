import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  numberCode: Number,
  deviceType: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    // ref: "DeviceType",
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
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    // ref: "DeviceState",
    required: true,
    default: "Recibido",
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
      author: String,
      observations: String,
    },
  ],
  lastRepairPrice: { type: Number, default: 0 },
});

export default mongoose.model("Device", deviceSchema);
