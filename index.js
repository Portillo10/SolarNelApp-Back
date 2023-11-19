import { config } from "dotenv";
config()
import {Server} from './models/server.model.js'

const app = new Server()
app.listen()