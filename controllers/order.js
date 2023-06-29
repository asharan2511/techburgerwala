import asynchandler from "express-async-handler";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Errorhandler from "../utils/ErrorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto";

const createOrder = asynchandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItem,
    payment,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;
  const user = req.user._id;
  const order = {
    shippingInfo,
    orderItem,
    payment,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  await Order.create(order);
  res.status(200).json({ success: true, message: true });
});

const createOrderOnline = asynchandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItem,
    payment,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;
  const user = req.user._id;
  const orderInfo = {
    shippingInfo,
    orderItem,
    payment,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  const options = {
    amount: Number(totalAmount) * 100, // amount in the smallest currency unit
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({ success: true, order, orderInfo });
});

const paymentVerification = asynchandler(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderInfo,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await Order.create({
      ...orderInfo,
      paidAt: new Date(Date.now()),
      paymentInfo: payment._id,
    });

    res.status(201).json({
      success: true,
      message: `Order placed successfully. Payment ID ${payment._id}`,
    });
  } else {
    return next(Errorhandler("Payment Failed", 400));
  }
});

const myorder = asynchandler(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("user", "name");

  res.status(200).json({ success: true, orders });
});

const getOrderDetails = asynchandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name");
  if (!order) {
    return next(new Errorhandler("Invalid Order Id", 404));
  }
  res.status(200).json({ success: "true", order });
});

const getAdminOrders = asynchandler(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "name");
  res.status(200).json({ success: true, orders });
});

const processOrders = asynchandler(async (req, res, next) => {
  console.log("hello");
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Errorhandler("Invalid Order Id", 404));
  }

  if (order.orderStatus === "Preparing") order.orderStatus = "Shipped";
  else if (order.orderStatus === "Shipped") {
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date(Date.now());
  } else if (order.orderStatus === "Delivered")
    return next(new Errorhandler("Food Already Delivered", 400));

  await order.save();
  res
    .status(200)
    .json({ success: true, message: "Status updated Successfully" });
});
export default createOrder;
export {
  myorder,
  getOrderDetails,
  getAdminOrders,
  processOrders,
  createOrderOnline,
  paymentVerification,
};
