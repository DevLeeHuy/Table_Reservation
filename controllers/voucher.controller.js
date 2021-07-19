const voucherModel = require("../models/voucher.model");
const restaurantModel = require("../models/restaurant.model");

module.exports={
    getAll:async (req,res)=>{
        const listVoucher=await voucherModel.getAll();
        res.json(listVoucher);
    },
    add:async (req,res)=>{
        const Voucher={
            vouValue:req.body.vouValue,
            vouQuantity:req.body.vouQuantity,
            resID:req.body.resID,
            vouKey:req.body.vouKey
        }
        await voucherModel.add(Voucher);
        res.redirect('/manager/voucher')
    },
    index:async (req,res)=>{
        const Restaurants = await restaurantModel.getAllByManager(req.user.userID);
            res.render("./vwAdmin/voucherPage",{
            layout: "manager",
            Restaurants,
        })
    }
}