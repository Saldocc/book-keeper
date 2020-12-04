const modal = document.querySelector("#modal");
const modalShow = document.querySelector("#show-modal");
const modalClose = document.querySelector("#close-modal");
const bookmarkForm = document.querySelector("#bookmark-form");
const websiteNameEl = document.querySelector("#website-name");
const websiteUrlEl = document.querySelector("#website-url");
const bookmarksContainer = document.querySelector("#bookmarks-container");

let bookmarks = {};

/**
 * * About bookmarks, I used as arrays beforehand are more efficient when used as objects.
 * * When it's an array It takes 74 ms, but but when it's an object It takes 64 ms
 * **/

// validate form
function validate(nameValue, urlValue) {
  const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address.");
    return false;
  }
  // Valid
  return true;
}

//Show modal, Focus input
function showModal() {
  modal.classList.add("show");
  websiteNameEl.focus();
}

//delete bookmark
function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  //update bookmarks
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

//build bookmarks
function buildBookmarks() {
  bookmarksContainer.textContent = "";

  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    //item
    const item = document.createElement("div");
    item.classList.add("item");

    //close-icon
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash");
    deleteIcon.setAttribute("title", "Delete Bookmark");
    deleteIcon.setAttribute("id", "delete-bookmark");
    deleteIcon.setAttribute("onclick", `deleteBookmark('${id}')`);

    //information div
    const info = document.createElement("div");
    info.classList.add("name");

    //favicon of bookmark
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon of Site");

    //link of site
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    info.append(favicon, link);
    item.append(info, deleteIcon);
    bookmarksContainer.appendChild(item);
  });
}

//fetch bookmarks
function fetchBookmarks() {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    const id = `https://github.com/Saldocc`;
    bookmarks[id] = {
      name: "Saldoc",
      url: "https://github.com/Saldocc",
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  // control and add 'https://'
  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }
  // validate
  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

//modal evet listener
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () => modal.classList.remove("show"));
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show") : false
);

//event listener
bookmarkForm.addEventListener(`submit`, storeBookmark);

//on load fetch
fetchBookmarks();
