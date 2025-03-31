
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  console.log("ok from here");
  const token = req.cookies.jwt;
  console.log(token); // ✅ Get token from cookies
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token" });
  }

  const data=jwt.verify(token,process.env.JWT_SECRET);
//   console.log(data);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log(decoded);
    req.userId = decoded.userId; // ✅ Store userId in request
    next();
  });
};

export default verifyToken;
