import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import { technicianRoute } from "./modules/technician/technician.route";
import { adminRoute } from "./modules/admin/admin.route";
import { bookingRoute } from "./modules/bookings/bookings.router";
import { categoryRoute } from "./modules/category/category.route";
import { serviceRoute } from "./modules/services/service.route";
import { reviewRoute } from "./modules/review/review.router";

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
app.use('/api/categories', categoryRoute);
app.use('/api/services', serviceRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/reviews', reviewRoute);

export default app;
