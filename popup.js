// Updates the status of the extension (initialising or active)
chrome.runtime.sendMessage({action: "getStatus"}, function(response) {
    document.getElementById("extension-editable").innerHTML = response ? "running" : "initialising...";
});

// Updates the tab status (muted or unmuted)
chrome.runtime.sendMessage({action: "getMuted"}, function(response) {
    document.getElementById("tab-editable").innerHTML = response ? "muted" : "unmuted";
});

// Gets the count of silences ads
chrome.runtime.sendMessage({action: "getCount"}, function(response) {
    document.getElementById("count-editable").innerHTML = response.toString();
});