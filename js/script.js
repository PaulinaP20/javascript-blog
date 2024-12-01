"use strict";

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    console.log("Link was clicked!");
    console.log(clickedElement);

  /* [DONE] remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll(".titles a.active");

    for (let activeLink of activeLinks) {
        activeLink.classList.remove("active");
  }

  /* [DONE] add class 'active' to the clicked link */

    clickedElement.classList.add("active");

  /* [DONE] remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll(".posts .post.active");

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove("active");
  }

  /*[DONE] get 'href' attribute from the clicked link */

    const articleSelector = clickedElement.getAttribute("href");

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

    const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

    targetArticle.classList.add("active");
}


const optArticleSelector = ".post",
    optTitleSelector = ".post-title",
    optTitleListSelector = ".titles";

function generateTitleLinks(event) {
    console.log("the function generateTitleLinks has been called");

  /* [DONE] remove contents of titlelist */
    const titleList = document.querySelector(optTitleListSelector);

    titleList.innerHTML = "";

  /*[DONE] for each article */

    const articles = document.querySelectorAll(optArticleSelector);

    let html = "";

    for (let article of articles) {
    /*[DONE] get the article id */
        const articleId = article.getAttribute("id");

    /*[DONE] find and get the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /*[DONE] create html of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /*[DONE] insert link into titleList */

        titleList.insertAdjacentHTML("beforeend", linkHTML);
  }

    const links = document.querySelectorAll(".titles a");

    for (let link of links) {
        link.addEventListener("click", titleClickHandler);
  }
}

generateTitleLinks();
