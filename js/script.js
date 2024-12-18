'use strict';

/* Global Handlebars */

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink:Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink:Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink:Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorList:Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
};

const opts={
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector:'.titles',
  articleTagsSelector:'.post-tags .list',
  articleAuthorSelector:'.post-author',
  tagsListSelector:'.tags.list',
  cloudClassCount:5,
  cloudClassPrefix:'tag-size-',
  authorListSelector:'.list.authors',
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(clickedElement);

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts .post.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /*[DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector='') {
  console.log('the function generateTitleLinks has been called');

  /* [DONE] remove contents of titlelist */
  const titleList = document.querySelector(opts.titleListSelector);

  titleList.innerHTML = '';

  /*[DONE] for each article */

  const articles = document.querySelectorAll(opts.articleSelector+customSelector);
  console.log(articles);

  for (let article of articles) {
  /*[DONE] get the article id */
    const articleId = article.getAttribute('id');

    /*[DONE] find and get the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /*[DONE] create html of the link */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    /*[DONE] insert link into titleList */

    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
  /* define the params object */
  const params ={
    max:0,
    min:999999
  };
  /*start loop for each tags */
  for (let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    /*use Math.min and Math.max*/
    if(tags[tag]>params.max){
      params.max=tags[tag];
    }

    if (tags[tag]<params.min){
      params.min=tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount=count-params.min;
  const normalizedMax = params.max-params.min;
  const percentage =normalizedCount/normalizedMax;
  const classNumber= Math.floor(percentage*(opts.cloudClassCount-1)+1);

  return opts.cloudClassPrefix+ classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles=document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */
  for (let article of articles){

    /* find tags wrapper */
    const tagsWrapper=article.querySelector(opts.articleTagsSelector);

    /* make html variable with empty string */
    let html='';

    /* get tags from data-tags attribute */
    const articleTags=article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTMLData = {tag: tag,};
      const linkHTML = templates.tagLink(linkHTMLData);

      /* add generated code to html variable */
      html += linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array */
        allTags[tag]=1;
      }else  {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML=html;

    /* END LOOP: for every article: */

  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);

  /*[NEW] create variable for all links HTML code adn add calculatrtagsParams */
  const tagsParams=calculateTagsParams(allTags);
  console.log('tagsParams: ', tagsParams);

  const allTagsData={tags:[]};

  /*[NEW] START LOOP:for each tag in allTags */
  for (let tag in allTags) {
    /*[NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkHTML=calculateTagClass(allTags[tag],tagsParams);
    console.log('tagLinkHTML: ', tagLinkHTML);

    allTagsData.tags.push({
      tag:tag,
      count:allTags[tag],
      className:calculateTagClass(allTags[tag],tagsParams)
    });
  }
  /*[NEW] END LOOP: for each tag in allTags */
  tagList.innerHTML=templates.tagCloudLink(allTagsData);
  console.log(allTags);
}

generateTags();


function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement=this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href=clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag =href.replace('#tag-','');
  console.log(tag);


  /* find all tag links with class active */
  const activeTags=document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let tag of activeTags){
    /* remove class active */
    tag.classList.remove('active');
    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks= document.querySelectorAll('a[href="'+href+'"]');

  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks){
  /* add class active */
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks=document.querySelectorAll('.post-tags a, .tags a');

  /* START LOOP: for each link */
  for(let tagLink of tagLinks){
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}
addClickListenersToTags();






function generateAuthors(){
  /*create a new variable allAuthor with empty object*/
  let allAuthors={};

  /* find all articles */
  const articles=document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find author wrapper */
    const authorWrapper=article.querySelector(opts.articleAuthorSelector);

    /* make html variable with empty string */
    let html='';
    /* get author from data-author attribute */
    const author=article.getAttribute('data-author');

    /* generate HTML of the link */
    const linkHTMLData = { author:author };
    const linkHTML = templates.authorLink(linkHTMLData);

    /* add generated code to html variable */
    html+=linkHTML;

    /* insert HTML of all the links into the author wrapper */
    authorWrapper.innerHTML=html;

    /* check if this link is not already in allAuthors */
    if (!allAuthors.hasOwnProperty(author)){
      /*add author to allAuthor object */
      allAuthors[author]=1;
    } else {
      allAuthors[author]++;
    }
    /* END LOOP: for every article: */
  }

  /* find list of authors in right column */
  const authorList = document.querySelector(opts.authorListSelector);

  /* generate HTML list with authors */
  const allAuthorsData ={authors: []};

  /* Start loop for each author */
  for (let author in allAuthors) {
    /* generate code of a link and add it to allAuthorHTML */
    allAuthorsData.authors.push({
      author:author,
      count:allAuthors[author],
    });
    /* END LOOP for each author */
  }
  authorList.innerHTML=templates.authorList(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement=this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href=clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author =href.replace('#author-','');

  /* find all author links with class active */
  const activeAuthors=document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active author link */
  for (let activeAuthor of activeAuthors){
    /* remove class active */
    activeAuthor.classList.remove('active');
    /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks=document.querySelectorAll('a[href="'+href+'"]');

  /* START LOOP: for each found author link */
  for (let authorLink of authorLinks){
    /* add class active */
    authorLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors(){
  /* find all links to author */
  const authorLinks = document.querySelectorAll('.post-author a, .authors a');

  /* START LOOP: for each link */
  for(let authorLink of authorLinks){
    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();

