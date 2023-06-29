import app from "./app.js";
import { connectDb } from "./config/dbConnection.js";
import Razorpay from "razorpay";
const port = process.env.PORT || 5000;
connectDb();
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.listen(port, () => {
  console.log(`Server is running on ${port},in ${process.env.NODE_ENV} MODE`);
});
