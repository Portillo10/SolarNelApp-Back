import {Router} from 'express'
import { addDevice, generateId, getDevices, getDevice, repairDevice, updateDeviceState, getDeviceBrands, getNumberCode, getDeviceStadistics, getStadistics, updateDevice } from '../controllers/device.controller.js';
import { validateJWT } from '../middlewares/validateJWT.js';

const router = Router();

router.post("/", addDevice)

router.post("/repair", [validateJWT], repairDevice)

router.put("/update_state/:deviceId", updateDeviceState)

router.put("/update", updateDevice)

router.get("/all", getDevices)

router.get("/one/:deviceId", getDevice)

router.get("/getid", generateId)

router.get("/brands", getDeviceBrands)

router.get("/number_code", getNumberCode)

router.get("/stadistics", getDeviceStadistics)

router.get("/general_stadistics", getStadistics)

export default router