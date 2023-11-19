import deviceModel from "../models/device.model.js";
import replacementModel from "../models/replacement.model.js";

const nextState = {
  recibido: "reparado",
  reparado: "entregado",
  entregado: "recibido",
};

export const STATES_ENUM = {
  Received: "recibido",
  Repaired: "reparado",
  Delivered: "entregado",
};

export const updateState = (state = "") => {
  return nextState[state.toLowerCase()];
};

export const calcPrice = (replacements = []) => {
  let totalPrice = 0;
  replacements.forEach((replacement) => {
    totalPrice += replacement.price * replacement.quantity;
  });
  return totalPrice;
};

export const getReplacementsByHistory = async (history = []) => {
  const idList = [];

  history.forEach(({ replacements = [] }) => {
    const replacementid = replacements.map((rep) => rep.replacementId);
    idList.push(...replacementid);
  });

  return await replacementModel.find({ _id: idList }, ["-__v"]);
};

export const formatHistory = async (history = []) => {
  const replacementList = await getReplacementsByHistory(history);

  return history.map((repair) => {
    const finalReplacementList = repair.replacements.map((rep) => {
      const tempReplacement = replacementList.find(
        (replacement) =>
          replacement._id.toString() === rep.replacementId.toString()
      );
      return {
        quantity: rep.quantity,
        replacement: tempReplacement,
      };
    });

    const { replacements, ...restRepair } = repair;
    return {
      ...restRepair._doc,
      replacements: finalReplacementList,
    };
  });
};

export const getAllDevices = async () => {
  const deviceList = await deviceModel.find({}, ["-history", "-__v"]);

  const received = deviceList
    .filter((device) => device.state.toLowerCase() === "recibido")
    .map((device) => {
      const { deviceType, brand, ...restDeviceProps } = device._doc;
      return {
        ...restDeviceProps,
        deviceType: deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
        brand: brand.charAt(0).toUpperCase() + brand.slice(1),
      };
    });

  const repaired = deviceList
    .filter((device) => device.state.toLowerCase() === "reparado")
    .map((device) => {
      const { deviceType, brand, ...restDeviceProps } = device._doc;
      return {
        ...restDeviceProps,
        deviceType: deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
        brand: brand.charAt(0).toUpperCase() + brand.slice(1),
      };
    });
    
  const delivered = deviceList
    .filter((device) => device.state.toLowerCase() === "entregado")
    .map((device) => {
      const { deviceType, brand, ...restDeviceProps } = device._doc;
      return {
        ...restDeviceProps,
        deviceType: deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
        brand: brand.charAt(0).toUpperCase() + brand.slice(1),
      };
    });

  return {
    received,
    repaired,
    delivered,
  };
};

export const idGenerator = (quantity) => {
  const idList = [];
  for (let i = 0; i < quantity; i++) {
    const device = new deviceModel()._id;
    idList.push(device.toString());
  }
  return idList;
};

// (async () => console.log(
//   await formatHistory([
//     {
//       replacements: [
//         { replacementId: "654d3362f7e80d12cb9a2ea8", quantity: 1 },
//         { replacementId: "654d4115ab77da4c53cdb7b5", quantity: 2 },
//       ],
//       author: "afesgbnhm",
//       repairDate: new Date().toLocaleDateString()

//     },
//     {
//       replacements: [
//         { replacementId: "654d3362f7e80d12cb9a2ea8", quantity: 1 },
//         { replacementId: "65514ef2ab77da4c53cdb7bd", quantity: 4 },
//       ],
//       author: "afesgbnhm",
//       repairDate: new Date().toLocaleDateString()
//     },
//   ])
// ))()
