const express = require("express");
const router = express.Router();
const managerCtrl = require("../controllers/manager.controller");
const voucherCtrl = require("../controllers/voucher.controller");
const db = require("../utils/db");

router.use("/product", require("./product.route"));
// router.use("/user", require("./user.route"));
router.get("/resetRevenues/:id", managerCtrl.resetRevenues);
router.get("/BookingList", managerCtrl.BookingList);
router.get("/confirm", managerCtrl.confirmBooking);
router.get("/cancel", managerCtrl.cancelBooking);
router.get("/history", managerCtrl.BookingHistory);
router.get("/DesignMenu", managerCtrl.DesignMenu);
router.get("/Menu", managerCtrl.addMenu);
router.post("/Menu", managerCtrl.saveMenu);
router.get("/", managerCtrl.index);
router.get("/voucher", voucherCtrl.index);

router.post("/voucher", voucherCtrl.add);
router.get("/voucher/all", voucherCtrl.getAll);

module.exports = router;
