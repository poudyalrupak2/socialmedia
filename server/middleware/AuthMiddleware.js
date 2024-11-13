import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWTKEY;

const authMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing in authorization header" });
    }

    const decoded = jwt.verify(token, secret);
    req.body._id = decoded?.id;
    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleWare;
