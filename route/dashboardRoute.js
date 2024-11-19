const router = require("express").Router();
const {
    authentification,
    restriction,
} = require("../controller/authController");
const { getDashboardData } = require("../controller/dashboardController");

router.route("/").get( getDashboardData);

module.exports = router;    