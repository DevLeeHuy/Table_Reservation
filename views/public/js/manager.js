document.querySelector(".add_product").addEventListener("click", function () {
  window.location.replace("/manager/product/add");
});

document
  .querySelector(".manage_product")
  .addEventListener("click", function () {
    window.location.replace("/manager/product/edit");
  });
document.querySelector(".booking_list").addEventListener("click", function () {
  window.location.replace("/manager/BookingList");
});

document.querySelector(".voucher-generator").addEventListener("click", () => {
  window.location.replace("/manager/voucher");
});
document.querySelector(".design_menu").addEventListener("click", function () {
  window.location.replace("/manager/DesignMenu");
});
document.querySelector(".history").addEventListener("click", function () {
  window.location.replace("/manager/history");
});

//voucher

const btnGenerate = document.getElementById("voucher-generate-btn");
const voucher = document.getElementById("voucher-key");
btnGenerate.addEventListener("click", () => {
  $.ajax({
    url: `/manager/voucher/all`,
    type: "GET",
  }).then((data) => {
    var voucherValue = "";
    if (data.length > 0) {
      while (true) {
        voucherValue = gernateVoucher(7);
        var exits = data.find((e) => e.vouValue == voucherValue);
        if (!exits) {
          voucher.value = voucherValue;
          return;
        }
      }
    } else {
      voucherValue = gernateVoucher(7);
      voucher.value = voucherValue;
    }
  });
});

function gernateVoucher(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
