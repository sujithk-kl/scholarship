const express = require('express');
const { getAnnouncements, getSchemes } = require('../controllers/publicController');

const router = express.Router();

router.get('/announcements', getAnnouncements);
router.get('/schemes', getSchemes);

module.exports = router;
