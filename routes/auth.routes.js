import {Router} from 'express'
import { getCookie, login, register } from '../controllers/auth.controller.js'

const router = Router()

router.post("/register", register)

router.post("/login", login)

router.get("/", getCookie)

export default router