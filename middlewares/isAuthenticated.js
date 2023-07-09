import Errorhandler from "../utils/ErrorHandler.js";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies["connect.sid"];
  console.log(token);
  if (!token) {
    return next(new Errorhandler("Not Loggedin", 401));
  }
  next();
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new Errorhandler("Only Admin Allowed", 405));
  }
  next();
};

export default isAuthenticated;
export { authorizeAdmin };
