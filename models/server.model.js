import express from "express";
import cors from "cors";
import { dbConnection } from "../db/dbConecction.js";
import {
  authRoutes,
  deviceRoutes,
  replacementRoutes,
  pointRoute,
} from "../routes/index.routes.js";
import cookieParser from "cookie-parser";
import axios from "axios";

const workDays = [1, 2, 3, 4, 5, 6];

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.middlewares();
    this.routes();
    this.dbConnection();

    this.interval = setInterval(this.renewSession, 1000 * 60 * 15);
  }

  renewSession() {
    const today = new Date();
    const currentDay = today.getDay();
    const currentHour = today.getHours() - 5;
    console.log(today.toDateString())
    if (workDays.includes(currentDay) && currentHour < 20 && currentHour > 7) {
      console.log(today.toDateString(), "renew hour:", currentHour);
      axios
        .get("https://solarnelapp-back.onrender.com/renew")
        .then((resp) => console.log(resp.data))
        .catch((err) =>
          console.log("Algo falló mientras se intentaba renovar la sesión")
        );
    }
  }

  routes() {
    this.app.use("/device", deviceRoutes);
    this.app.use("/replacement", replacementRoutes);
    this.app.use("/auth", authRoutes);
    this.app.use("/renew", pointRoute);
  }

  middlewares() {
    this.app.use(cors({ credentials: true, origin: true }));

    this.app.use(cookieParser());

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
      dbConnection();
    } catch (error) {
      console.log(error);
    }
  }
}
