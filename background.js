updateBlockedDomainList().then(data => {
    const blockedDomainList = data.blockedDomainList;

    console.log(blockedDomainList);

    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            const url = details.url;
            if (!isValidRequest(url)) return;
        
            const domain = findDomainByUrl(url);
            if (!isDomainInBlockedList(domain)) return;

            updateSessionStorage(domain, url);
            redirectUserToBlockedPage();
        },
        { 
            urls: ["<all_urls>"],
            types: ["main_frame"]
        },
        []
    );

    // fix tabs cannot be edited right now (user may be dragging a tab)
    // Operation not allowed for DevTools windows.
    //
    // You may pass an instance of tab here, checking for
    // the necessary states like whether a user is moving it or is in DevTools.
    //
    // or simply add try catches here.
    function isValidRequest(url) {
        if (url === "chrome-extension://aplingkdffoigcioeildabnlhkkbcdik/block/blocked.html") 
            return false;
        else if (url === "chrome-extension://aplingkdffoigcioeildabnlhkkbcdik/popup/popup.html")
            return false;

        return true;
    }

    function findDomainByUrl(url) {
        return new URL(url).hostname;
    }

    function isDomainInBlockedList(domain) {
        return blockedDomainList.includes(domain);
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
});

function updateBlockedDomainList() {
    return chrome.storage.sync.get(["blockedDomainList"]) || [];
}