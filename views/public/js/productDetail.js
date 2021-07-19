var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  // var captionText = document.getElementById("caption");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  // captionText.innerHTML = dots[slideIndex - 1].alt;
}

function showReplyForm(index) {
  var replyForm = document.querySelectorAll(".replyForm");
  replyForm.forEach((e) => {
    e.style.display = "none";
  });
  replyForm[index].style.display = "block";
}
var replyBox = document.querySelectorAll(".replyForm");
replyBox.forEach((e) => {
  e.style.display = "none";
});
var closeReply = document.querySelectorAll(".buttonClose");
closeReply.forEach((e) => {
  e.addEventListener("click", function () {
    var replyForm = e.parentElement.parentElement;
    replyForm.style.display = "none";
  });
});

//Rating button
var ratingBtn = document.querySelectorAll(".rating-btn");
var ratingPoint = document.querySelector("#rating-point");
console.log(ratingBtn);
ratingBtn.forEach(function (e) {
  e.addEventListener("click", function () {
    ratingBtn.forEach(function (e) {
      e.style.fontSize = "28px";
      e.style.backgroundColor = "";
    });
    e.style.fontSize = "40px";
    e.style.backgroundColor = "green";
    ratingPoint.value = Array.prototype.indexOf.call(ratingBtn, e) + 1;
  });
});

document
  .querySelector(".resDetail__menu")
  .addEventListener("click", function () {
    window.location.replace(
      `/viewMenu?id=${document.getElementById("resID").value}`
    );
  });
