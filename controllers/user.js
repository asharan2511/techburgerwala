import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Order from "../models/Order.js";
const myProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
});

const logout = asyncHandler(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid", {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    });
    res.status(200).json({ message: "Logged Out" });
  });
});

const getAdminUsers = asyncHandler(async (req, res, next) => {
  const user = await User.find({});
  res.status(200).json({ success: true, user });
});

const getAdminStats = asyncHandler(async (req, res, next) => {
  const userCount = await User.countDocuments();
  const orders = await Order.find({});
  const preparingOrder = orders.filter((i) => i.orderStatus === "Preparing");
  const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
  const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");
  let totalIncome = 0;
  orders.forEach((i) => {
    totalIncome += i.totalAmount;
  });
  res.status(200).json({
    success: true,
    userCount,
    ordersCount: {
      total: orders.length,
      preparing: preparingOrder.length,
      shipped: shippedOrders.length,
      delivered: deliveredOrders.length,
    },
    totalIncome,
  });
});

export default myProfile;
export { logout, getAdminUsers, getAdminStats };
