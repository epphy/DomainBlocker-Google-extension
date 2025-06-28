const goBackButton = document.getElementById("go-back");
const editListButton = document.getElementById("edit-list");
const domainLinkButton = document.getElementById("domain-name");
const windowHistoryLength = window.history.length;
let isGoBackButtonStateSet = false;
let domainName = "none";
let realUrl = "";

chrome.storage.session.get({ ["blockedDomain"]: "none", ["blockedUrl"]: "" }, (items) => {
    domainName = items.blockedDomain || "none";
    realUrl = items.blockedUrl || "";

    domainLinkButton.textContent = domainName;
});

domainLinkButton.addEventListener("click", () => {
    if (realUrl === "") {
        return;
    }

    navigator.clipboard.writeText(realUrl);
});

goBackButton.addEventListener("click", () => {
    window.history.back();
});

goBackButton.addEventListener("mouseenter", () => {
    if (isGoBackButtonStateSet) {
        return;
    }

    isGoBackButtonStateSet = true;

    if (windowHistoryLength > 1) {
        return;
    }

    goBackButton.style.cursor = "not-allowed";
});