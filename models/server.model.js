import express from "express";
import cors from "cors";
import {dbConnection} from '../db/dbConecction.js'
import {authRoutes, deviceRoutes, replacementRoutes} from '../routes/index.routes.js'
import cookieParser from 'cookie-parser'

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.middlewares()
    this.routes()
    this.dbConnection()
  }

  routes() {
    this.app.use("/device", deviceRoutes)
    this.app.use("/replacement", replacementRoutes)
    this.app.use("/auth", authRoutes)
  }

  middlewares() {
    this.app.use(cors({credentials:true, origin: true}));

    this.app.use(cookieParser())

    // lecture del body
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(express.json());

    this.app.use(express.static("public"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Running on port:", this.port);
    });
  }

  dbConnection() {
    try {
      dbConnection()
    } catch (error) {
      console.log(error)
    }
  }
}
