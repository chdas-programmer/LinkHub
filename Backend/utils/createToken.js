import jwt from "jsonwebtoken";

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

const createToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie('jwt',token , {
    httpOnly: true,
    secure: true, // Ensure HTTPS in production
    sameSite: 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  

  return token;
};

export default createToken;
