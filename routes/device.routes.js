import {Router} from 'express'
import { addDevice, generateId, getDevices, getDevice, repairDevice, updateDeviceState, getDeviceBrands, getNumberCode } from '../controllers/device.controller.js';

const router = Router();

router.post("/", addDevice)

router.post("/repair", repairDevice)

router.get("/one/:deviceId", getDevice)

router.get("/all", getDevices)

router.put("/:deviceId", updateDeviceState)

router.get("/getid", generateId)

router.get("/brands", getDeviceBrands)

router.get("/number_code", getNumberCode)

export default router