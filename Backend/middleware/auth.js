import { verifyToken } from "../utils/jwt.js";
 
export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded =  verifyToken(token) // Correct function usage
    req.user = decoded; // Attach the user info (e.g., ID) to the request
  
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
 