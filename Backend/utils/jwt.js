import jwt from "jsonwebtoken";
import { environment } from "../config/environment.js";
const JWT_SECRET = environment.jwt.secret
const JWT_EXPIRES_IN = environment.jwt.expiresIn

export const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
