import {Router} from 'express'
import { addReplacement, addReplacementType, getReplacements } from '../controllers/replacement.controller.js'

const router = Router()

router.post("/new", addReplacement)

router.post("/new_type", addReplacementType)

router.get("/all", getReplacements)


export default router