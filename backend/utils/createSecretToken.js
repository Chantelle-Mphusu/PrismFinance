import jwt from "jsonwebtoken";

export const createSecretToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};