// variable declaration

// init / active
var status = 0;
// muted / unmuted
var muted = false;
// Key to use in local storage to store the ad count
adCountKey = 'adCount';
// number of silenced ads
sessionCount = 0;

// if local storage ad count doesn't exist, init to 0
if (!localStorage[adCountKey]) {
    localStorage[adCountKey] = this.sessionCount;
} else {
    // otherwise, initialise the current count to the last session
    this.sessionCount = localStorage[adCountKey];
}

// Communicate with the popup (see popul.html) to get the extension status
// And with the actual Spotify page (see silencer.js) to mute / unmute the current tab.
// using the runtime messages (request triggered by the popup, not the other way around.)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "soundOn") {
            // unmutes the current active tab where spotify is running
            // Typically, once an ad just finished running and a new song is now running.
            soundOn(sender.tab);
        } else if (request.action == "soundOff") {
            // Mutes the current active tab where spotify is running
            // That is when a running ad is detected on the Spotify player
            soundOff(sender.tab);
        } else if (request.action == "initialised") {
            // silencer.js warns that the listener for the ad has been initialised.
            // This status is then used to update the popup and inform the user of the extension status
            // 0 = initialising / 1 = active (initialised)
            this.status = 1;
            // Set the popup on
            chrome.pageAction.show(sender.tab.id);
        } else if (request.action == "getStatus") {
            // Popup reauests the status of the app (see above)
            sendResponse(this.status);
        } else if (request.action == "getMuted") {
            // Know if the current tab is muted by the extension or not.
            // this.muted = 1 means muted, 0 means unmuted
            sendResponse(this.muted);
        } else if (request.action == "getCount") {
            // Gets the number of ads silenced by the extension (for the popup display)
            sendResponse(this.sessionCount);
        }
    }
);

/**
 * Mutes the tab
 * @param {Tab} tab the Tab object (active tab that is running Spotify) to be muted
 */
function soundOff(tab) {
    // If already unmuted, do nothing
    if (!tab.mutedInfo.muted) {
        // using the Tab API, set "muted" property to true
        // Then update the number of muted ads
        chrome.tabs.update(tab.id, {muted: true}, function(tab) {
            this.muted = true;
            this.updateCount();
        });
    }
}

/**
 * Unmutes the tab
 * @param {Tab} tab The Tab object to be unmuted (Typically, the tab running spotify once the ad finishes)
 */
function soundOn(tab) {
    // If already muted, do nothing
    if (tab.mutedInfo.muted) {
        // using the Tab API, set "muted" property to false
        chrome.tabs.update(tab.id, {muted: false}, function(tab) {
            this.muted = false;
        });
    }
}

/**
 * Updates the muted ad count
 */
function updateCount() {
    // increment the current ad count, and updates the local storage for next session.
    this.sessionCount++;
    localStorage[adCountKey] = this.sessionCount;
}