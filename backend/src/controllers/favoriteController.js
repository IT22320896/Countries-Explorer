const User = require('../models/User');

// @desc    Add country to favorites
// @route   POST /api/favorites
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const { countryCode } = req.body;

    if (!countryCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a country code'
      });
    }

    // Find user and update favorites
    const user = await User.findById(req.user.id);

    // Check if country is already in favorites
    if (user.favorites.includes(countryCode)) {
      return res.status(400).json({
        success: false,
        message: 'Country already in favorites'
      });
    }

    user.favorites.push(countryCode);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove country from favorites
// @route   DELETE /api/favorites/:countryCode
// @access  Private
exports.removeFavorite = async (req, res) => {
  try {
    const { countryCode } = req.params;

    // Find user and update favorites
    const user = await User.findById(req.user.id);

    // Check if country is in favorites
    if (!user.favorites.includes(countryCode)) {
      return res.status(400).json({
        success: false,
        message: 'Country not in favorites'
      });
    }

    // Remove country from favorites
    user.favorites = user.favorites.filter(code => code !== countryCode);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 