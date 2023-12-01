import { toUpper } from "../helpers/device.helper.js";
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
  const { typeDesc, replacementProps } = req.body;

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
      replacementProps,
    });

    await newReplacementType.save();

    return res.status(200).json(newReplacementType);
  } catch (error) {
    return res.status(500).json({ msg: "Internal error" });
  }
};

export const getReplacementTypes = async (req, res) => {
  try {
    let replacementTypes = await replacementTypeModel.find({}, ["-__v"]);
    replacementTypes = replacementTypes.map(replacementType => {
      let {typeDesc, replacementProps} = replacementType._doc
      replacementProps = replacementProps.map(property => {
        const {prop, ...rest} = property._doc
        return {prop:toUpper(prop), ...rest}
      })
      return {
        typeDesc:toUpper(typeDesc),
        replacementProps
      }
    })
    return res.status(200).json(replacementTypes);
  } catch (error) {
    console.log(error)
  }
};

export const getReplacements = async (req, res) => {
  try {
    const replacementList = await replacementModel.find({}, ["-__v"]);

    return res.json(replacementList);
  } catch (error) {
    console.log(error);
  }
};

