const express = require("express");
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoriteController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

router.route("/").get(getFavorites).post(addFavorite);

router.delete("/:countryCode", removeFavorite);

module.exports = router;
