require("dotenv").config();
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  //   console.log("he", req);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SecretKey, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};
module.exports = {
  verifyToken: verifyToken,
};
