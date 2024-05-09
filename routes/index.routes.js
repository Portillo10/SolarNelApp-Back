import deviceRoutes from './device.routes.js'
import replacementRoutes from './replacement.routes.js'
import authRoutes from './auth.routes.js'
import {renewSession} from '../controllers/point.controller.js'

import { Router } from 'express'

const pointRoute = Router()

pointRoute.get("/", renewSession)

export {
  deviceRoutes,
  replacementRoutes,
  authRoutes,
  pointRoute
}