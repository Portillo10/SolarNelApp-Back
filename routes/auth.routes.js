import {Router} from 'express'
import { changePassword, getCookie, login, register } from '../controllers/auth.controller.js'

const router = Router()

router.post("/register", register)

router.post("/login", login)

router.get("/", getCookie)

router.post("/changepass", changePassword)


export default router