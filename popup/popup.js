const addButton = document.getElementById("addButton");
const domainInput = document.getElementById("domainInput");
const list = document.getElementById("blockedList");

function updateList() {
    chrome.storage.sync.get(["blockedDomainList"], (response) => {
        list.innerHTML = "";
        const blockedDomainList = response.blockedDomainList || [];

        blockedDomainList.forEach(blockedDomain => {
            prepareBlockedDomain(blockedDomainList, blockedDomain);
        });
    });
}

function prepareBlockedDomain(blockedDomainList, blockedDomain) {
    const li = document.createElement("li");
    li.textContent = blockedDomain;
    li.title = blockedDomain;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "x";
    deleteButton.title = "Remove";
    deleteButton.addEventListener("click", () => handleBlockedDomainRemoval(blockedDomainList, blockedDomain));

    appendBlockedDomain(li, deleteButton);
}

function appendBlockedDomain(blockedDomain, deleteButton) {
    blockedDomain.appendChild(deleteButton);
    list.appendChild(blockedDomain);
}

function handleBlockedDomainRemoval(blockedDomainList, blockedDomain) {
    const updatedBlockedDomainList = blockedDomainList.filter(d => d !== blockedDomain);
    chrome.storage.sync.set({ "blockedDomainList": updatedBlockedDomainList }, updateList);
}

addButton.addEventListener("click", () => {
    const domain = domainInput.value.trim();
    chrome.storage.sync.get(["blockedDomainList"], (response) => {
        const blockedDomainList = response.blockedDomainList || [];
        if (!isDomainValid(blockedDomainList, domain)) return;
        blockedDomainList.push(domain);
        chrome.storage.sync.set({"blockedDomainList": blockedDomainList}, () => {
            domainInput.value = "";
            updateList();
        });
    });
});

function isDomainValid(blockedDomainList, domain) {
    if (!domain) return false;
    if (blockedDomainList.includes(domain)) return false;
    return true;
}

updateList();