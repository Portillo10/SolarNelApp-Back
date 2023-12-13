import deviceModel from "../models/device.model.js";
import replacementModel from "../models/replacement.model.js";
import userModel from "../models/user.model.js";

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

const weekDaysEnum = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
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

export const getAuthorsByHistory = async (history = []) => {
  const idList = [];

  history.forEach(({ author }) => {
    idList.push(author);
  });

  return await userModel.find({ _id: idList }, [
    "-__v",
    "-password",
    "-username",
  ]);
};

export const formatHistory = async (history = []) => {
  const replacementList = await getReplacementsByHistory(history);
  const users = await getAuthorsByHistory(history);

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

    const finalAuthor = users.find(
      (user) => user._id.toString() === repair.author.toString()
    );

    // console.log(toUpper(finalAuthor.firstname))

    const { replacements, author, ...restRepair } = repair;
    return {
      ...restRepair._doc,
      replacements: finalReplacementList,
      author: toUpper(finalAuthor.firstname) + toUpper(finalAuthor.lastname),
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
        deviceType: toUpper(deviceType),
        brand: toUpper(brand),
      };
    });

  const repaired = deviceList
    .filter((device) => device.state.toLowerCase() === "reparado")
    .map((device) => {
      const { deviceType, brand, ...restDeviceProps } = device._doc;
      return {
        ...restDeviceProps,
        deviceType: toUpper(deviceType),
        brand: toUpper(brand),
      };
    });

  const delivered = deviceList
    .filter((device) => device.state.toLowerCase() === "entregado")
    .map((device) => {
      const { deviceType, brand, ...restDeviceProps } = device._doc;
      return {
        ...restDeviceProps,
        deviceType: toUpper(deviceType),
        brand: toUpper(brand),
      };
    });

  return {
    received,
    repaired,
    delivered,
  };
};

export const toUpper = (word = "") => {
  const words = word.split(" ");
  let finalWord = "";
  words.forEach((w) => {
    finalWord += `${w.charAt(0).toUpperCase()}${w.slice(1)}${
      words.length > 1 ? " " : ""
    }`;
  });
  return finalWord;
};

export const idGenerator = (quantity, lastNumberCode) => {
  const idList = [];
  let numberCode = lastNumberCode;
  for (let i = 0; i < quantity; i++) {
    const device = new deviceModel()._id;
    idList.push({ id: device.toString(), numberCode });
    numberCode += 1;
  }
  return idList;
};

export const getRerpairedByDate = async (date) => {
  const devices = (
    await deviceModel.find(
      { state: [STATES_ENUM.Repaired, STATES_ENUM.Delivered] },
      ["-__v"]
    )
  ).filter((device) => {
    return device.history[0].repairDate.toDateString() === date.toDateString();
  });
  return devices;
};

export const getEarnings = async () => {
  const devices = (
    await deviceModel.find({ state: [STATES_ENUM.Delivered] }, ["-__v"])
  ).filter((device) => {
    return device.lastUpdate.toDateString() === new Date().toDateString();
  });

  let earning = 0;
  for (let device of devices) {
    earning += device.lastRepairPrice;
  }
  return earning;
};

export const getWeekStadistics = async () => {
  const lastWeekRepairs = await getLastWeekRepairs();
  const monday = lastWeekRepairs.filter(
    (repair) => repair.repairDate.getDay() === weekDaysEnum.MONDAY
  ).length;
  const tuesday = lastWeekRepairs.filter(
    (repair) => repair.repairDate.getDay() === weekDaysEnum.TUESDAY
  ).length;
  const wednesday = lastWeekRepairs.filter(
    (repair) => repair.repairDate.getDay() === weekDaysEnum.WEDNESDAY
  ).length;
  const thursday = lastWeekRepairs.filter(
    (repair) => repair.repairDate.getDay() === weekDaysEnum.THURSDAY
  ).length;
  const friday = lastWeekRepairs.filter(
    (repair) => repair.repairDate.getDay() === weekDaysEnum.FRIDAY
  ).length;
  const saturday = lastWeekRepairs.filter(
    (repair) => repair.repairDate.getDay() === weekDaysEnum.SATURDAY
  ).length;
  const sunday = lastWeekRepairs.filter(
    (repair) => repair.repairDate.getDay() === weekDaysEnum.SUNDAY
  ).length;

  return {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  };
};

export const getLastWeekRepairs = async () => {
  const devices = (
    await deviceModel.find(
      { state: [STATES_ENUM.Repaired, STATES_ENUM.Delivered] },
      ["-__v"]
    )
  )
    .filter(
      (device) =>
        new Date(new Date() - device.history[0].repairDate).getTime() /
          86400000 <=
        5
    )
    .map((device) => device.history[0]);
  return devices;
};
