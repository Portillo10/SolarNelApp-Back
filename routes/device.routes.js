import {Router} from 'express'
import { addDevice, generateId, getDevices, getDevice, repairDevice, updateDeviceState, getDeviceBrands, getNumberCode } from '../controllers/device.controller.js';
import { validateJWT } from '../middlewares/validateJWT.js';

const router = Router();

router.post("/", addDevice)

router.post("/repair", [validateJWT], repairDevice)

router.get("/one/:deviceId", getDevice)

router.get("/all", getDevices)

router.put("/:deviceId", updateDeviceState)

router.get("/getid", generateId)

router.get("/brands", getDeviceBrands)

router.get("/number_code", getNumberCode)

export default router