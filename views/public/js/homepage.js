// var findByCate = document.querySelectorAll('.res_cate');
// findByCate.forEach((e, index) => {
//     e.addEventListener('click', () => {
//         // // $.ajax({
//         // //     url: `/search/byCate?cate=${index + 1}`,
//         // //     type: 'Get',
//         // // }).then((data)=>{
//         // //     console.log(data);
//         // // });
// alert('2');
//         window.location.replace (`http://localhost:3000/search/byCate?cate=${index+1}`);
//     })
// });
const readmoreBtn = document.querySelector(".btn-readmore");
const hiddenNews = document.querySelectorAll(".news_hidden");
readmoreBtn = document.addEventListener("click", (e) => {
  console.log("Aaaaaaaaaaa");
  hiddenNews.forEach((news) => {
    news.classList.toggle("news-show");
    if (news.classList.contains("news-show")) {
      readmoreBtn.innerHTML = `<i class="fa fa-caret-up"></i>`;
    } else {
      readmoreBtn.innerHTML = `<i class="fa fa-caret-down"></i>`;
    }
  });
});
