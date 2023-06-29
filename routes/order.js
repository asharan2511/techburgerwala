import express from "express";
import createOrder, {
  createOrderOnline,
  getAdminOrders,
  getOrderDetails,
  myorder,
  paymentVerification,
  processOrders,
} from "../controllers/order.js";
import isAuthenticated, {
  authorizeAdmin,
} from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/createorder", isAuthenticated, createOrder);
router.post("/createorderonline", isAuthenticated, createOrderOnline);
router.post("/paymentverification", paymentVerification);
router.get("/myorders", isAuthenticated, myorder);
router.get("/order/:id", isAuthenticated, getOrderDetails);

// Add Admin Middleware
router.get("/admin/orders", isAuthenticated, authorizeAdmin, getAdminOrders);
router.get("/admin/orders/:id", isAuthenticated, authorizeAdmin, processOrders);

export default router;
