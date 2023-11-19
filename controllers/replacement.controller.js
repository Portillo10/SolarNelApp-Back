import replacementModel from "../models/replacement.model.js";
import replacementTypeModel from "../models/replacementType.model.js";

export const addReplacement = async (req, res) => {
  const { replacement } = req.body;

  try {
    const repeatedReplacement = await replacementModel.findOne({
      replacementType: replacement.type,
      value: replacement.value,
    });

    if (repeatedReplacement)
      return res.json({
        msg: "Repeated replacement",
        repeatedReplacement,
      });

    const newReplacement = new replacementModel(replacement);
    await newReplacement.save();

    return res.status(200).json(newReplacement);
  } catch (error) {
    return res.status(500).json({ msg: "Internal error", error });
  }
};

export const addReplacementType = async (req, res) => {
  const { typeDesc, replacementProp } = req.body;

  try {
    const repeatedReplacementType = await replacementTypeModel.findOne({
      typeDesc,
    });

    if (repeatedReplacementType)
      return res.json({
        msg: "Repeated replacement type",
        repeatedReplacementType,
      });

    const newReplacementType = new replacementTypeModel({
      typeDesc,
      replacementProp,
    });

    await newReplacementType.save();

    return res.status(200).json(newReplacementType);
  } catch (error) {
    return res.status(500).json({ msg: "Internal error" });
  }
};

export const getReplacementTypes = async (req, res) => {
  try {
    const replacementTypes = await replacementTypeModel.find({}, ["-__v"]);
    return res.status(200).json(replacementTypes);
  } catch (error) {}
};

export const getReplacements = async (req, res) => {
  try {
    const replacementList = await replacementModel.find({}, ["-__v"]);

    return res.json({ replacementList });
  } catch (error) {
    console.log(error);
  }
};

