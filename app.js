import express from "express";
import dotenv from "dotenv";
import { connectPassport } from "./utils/provider.js";
import session from "cookie-session";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();
dotenv.config();
export default app;

//using middlewares
app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_SECRETE],
    cookie: {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.enable("trust proxy");
connectPassport();

//importing Routes
import userRouter from "./routes/user.js";
import passport from "passport";
import orderRouter from "./routes/order.js";

app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

//using middlewares

app.use(errorMiddleware);
