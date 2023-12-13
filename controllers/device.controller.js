import { request } from "express";
import {
  updateState,
  STATES_ENUM,
  calcPrice,
  formatHistory,
  getAllDevices,
  idGenerator,
  getRerpairedByDate,
  getEarnings,
  getLastWeekRepairs,
  getWeekStadistics,
} from "../helpers/device.helper.js";
import deviceModel from "../models/device.model.js";
import deviceBrandModel from "../models/deviceBrand.model.js";
import replacementModel from "../models/replacement.model.js";

export const addDevice = async (req, res) => {
  try {
    const { device } = req.body;

    if (!device) return res.status(403).json({ msg: "Bad request" });

    const brandExist = await deviceBrandModel.findOne({
      brandName: device.brand.toLowerCase(),
    });

    !brandExist &&
      (await new deviceBrandModel({
        brandName: device.brand.toLowerCase(),
      }).save());

    const { brand, ...rest } = device;

    const newDevice = new deviceModel({ ...rest, brand: brand.toLowerCase() });
    await newDevice.save();

    res.status(200).json({
      newDevice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal error",
    });
  }
};

export const getDeviceBrands = async (req, res) => {
  try {
    const brands = await deviceBrandModel.find({}, ["-__v"]);

    const brandsToUpperCase = brands.map((brand = "") => {
      return brand.brandName.charAt(0).toUpperCase() + brand.brandName.slice(1);
    });

    return res.status(200).json({ brands: brandsToUpperCase });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal error" });
  }
};

export const getDevice = async (req, res) => {
  const { deviceId } = req.params;

  if (!deviceId)
    return res.status(400).json({
      msg: "missing device id",
    });

  try {
    const device = await deviceModel.findById(deviceId, ["-__v"]);

    if (device) {
      const { deviceType, brand, ...restDevice } = { ...device._doc };
      restDevice.history = await formatHistory(device.history);
      return res.status(200).json({
        device: {
          ...restDevice,
          deviceType: deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
          brand: brand.charAt(0).toUpperCase() + brand.slice(1),
        },
      });
    } else {
      return res.status(204).json({
        msg: "device doesn't exist",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal error",
    });
  }
};

export const updateDeviceState = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const device = await deviceModel.findById(deviceId);
    await device.updateOne({
      state: updateState(device.state),
      lastUpdate: new Date(),
    });

    res.status(200).json({
      device,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal error",
      error,
    });
  }
};

export const getDevices = async (req, res) => {
  try {
    const devices = await getAllDevices();

    return res.status(200).json({
      ...devices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Error",
    });
  }
};

export const generateId = async (req, res) => {
  try {
    const { quantity = 49, numberCode = 0 } = req.query;

    let lastCode = await lastNumberCode();

    if (numberCode < lastCode) {
      return res.status(400).json({
        msg: "El número debe ser mayor al último que se registró",
      });
    }

    lastCode = Number(numberCode);

    const idList = idGenerator(quantity, lastCode);

    return res.status(200).json({
      idList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal error",
    });
  }
};

export const repairDevice = async (req = request, res) => {
  const { deviceId, replacements, observations, totalPrice } = req.body;

  try {
    const currentDevice = await deviceModel.findById(deviceId);
    if (
      !currentDevice ||
      currentDevice.state.toLowerCase() !== STATES_ENUM.Received
    )
      return res.status(404).json({ msg: "Device can't be repaired" });

    currentDevice.state = updateState(currentDevice.state);

    const replacementList = await replacementModel.find({
      _id: replacements.map((rep) => rep.replacementId),
    });

    const indexedReplacements = replacements.reduce((acc, el) => {
      acc[el.replacementId] = el;
      return acc
    }, {});

    if (totalPrice >= 0) {
      currentDevice.lastRepairPrice = totalPrice;
    } else {
      const mapedReplacements = replacementList.map((rep) => {
        const tempReplacement = indexedReplacements[rep._id.toString()]
        return { price: rep.price, quantity: tempReplacement.quantity };
      });
      currentDevice.lastRepairPrice = calcPrice(mapedReplacements);
    }

    currentDevice.history.unshift({
      replacements,
      observations,
      author: req.user._id,
      repairPrice: currentDevice.lastRepairPrice,
    });

    await currentDevice.save();

    const { history } = currentDevice._doc;

    return res.status(200).json({ repair: history[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal error" });
  }
};

export const getNumberCode = async (req, res) => {
  try {
    const numberCode = await lastNumberCode();

    return res.status(200).json({ numberCode });
  } catch (error) {}
};

const lastNumberCode = async () => {
  const numberCode = (await deviceModel.find({}, ["numberCode"]))
    .map((dev) => dev.numberCode)
    .sort((a, b) => a - b);

  if (numberCode.length > 0) return numberCode[numberCode.length - 1] + 1;
  else return 1;
};

export const getDeviceStadistics = async (req, res) => {
  try {
    const pendingRepairs = await deviceModel.find(
      { state: STATES_ENUM.Received },
      ["-history", "-__v"]
    );
    const readyDevices = await deviceModel.find(
      { state: STATES_ENUM.Repaired },
      ["-history", "-__v"]
    );
    const repairedToday = await getRerpairedByDate(new Date());

    const earningsToday = await getEarnings();

    return res.status(200).json({
      pending: pendingRepairs.length,
      ready: readyDevices.length,
      repairedToday: repairedToday.length,
      earningsToday,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getStadistics = async (req, res) => {
  const result = await getWeekStadistics();
  res.status(200).json({
    result,
  });
};
