const express = require("express");
const router = express.Router();


// Load User Model
const User = require("../server/models/User");
// const Admin = require(".." + "/server/models/Admin");
const admin_controller = require("../controllers/adminController");
//Admin login
router.get('/', admin_controller.login);
router.post("/login", admin_controller.login);

// Add an employee with employeeId and departmentId
router.post("/add-employee", admin_controller.add);


module.exports = router;
