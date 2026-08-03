import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import { technicianRoute } from "./modules/technician/technician.route";
import { adminRoute, categoryRoute } from "./modules/admin/admin.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use('/api/auth', authRoute);
app.use('/api/technician', technicianRoute);
app.use('/api/admin', adminRoute);

export default app;
