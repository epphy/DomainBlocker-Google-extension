chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = details.url;

        if (!isValidRequest(url)) return;
        
        const domain = findDomainByUrl(url);

        if (isDomainInBlockedList(domain)) return;
        
        updateSessionStorage(domain, url);
        redirectUserToBlockedPage();
    },
    { 
        urls: ["<all_urls>"],
        types: ["main_frame"]
     },
    []
);

function isValidRequest(url) {
    if (url === "chrome-extension://aplingkdffoigcioeildabnlhkkbcdik/block/blocked.html") {
        return false;
    }

    return true;
}

function findDomainByUrl(url) {
    return new URL(url).hostname;
}

function isDomainInBlockedList(domain) {
    // open local storage
    // get blockedDomainList key
    // check if this string is included in it
    // return the answer
    return false;
}

function updateSessionStorage(domain, url) {
    chrome.storage.session.set({ 
        ["blockedDomain"]: domain,
        ["blockedUrl"]: url 
    });
}

function redirectUserToBlockedPage() {
    chrome.tabs.update({ url: "/block/blocked.html"});
}