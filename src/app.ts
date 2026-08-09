import cookieParser from "cookie-parser";
import express, { application, Application } from "express";
import cors from "cors";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import { technicianRoute } from "./modules/technician/technician.route";
import { adminRoute } from "./modules/admin/admin.route";
import { bookingRoute } from "./modules/bookings/bookings.router";
import { categoryRoute } from "./modules/category/category.route";
import { serviceRoute } from "./modules/services/service.route";
import { reviewRoute } from "./modules/review/review.router";
import { userRoute } from "./modules/user/user.route";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { paymentRoute } from "./modules/payment/payment.route";
import { paymentController } from "./modules/payment/payment.controller";

const app: Application = express();

app.post('/payments/confirm', express.raw({type: "application/json"}), paymentController.webhook)

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
app.use('/api', userRoute);
app.use('/api/technician', technicianRoute);
app.use('/api/admin', adminRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/services', serviceRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/reviews', reviewRoute);


app.use(notFound);
app.use(globalErrorHandler);

export default app;
