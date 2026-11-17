const express = require("express");
const jwt = require("jsonwebtoken");
const {
  getOffers,
  getHeaderOffers,
  getOfferById,
  createOffer,
  updateOffer,
  updateHeaderVisibility,
  deleteOffer,
} = require("../controllers/offersController");

const router = express.Router();

const requireAdmin = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    if (String(user.role || "").toLowerCase() !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }
    req.authUser = user;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Authentication token is invalid." });
  }
};

router.get("/header", getHeaderOffers);
router.use(requireAdmin);
router.get("/", getOffers);
router.get("/:id", getOfferById);
router.post("/", createOffer);
router.put("/:id", updateOffer);
router.patch("/:id/header", updateHeaderVisibility);
router.delete("/:id", deleteOffer);

module.exports = router;
