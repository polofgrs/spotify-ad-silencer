// Initialisation : check for element every second until it finds it
// (Typically, after DOM has loaded)
var intervalID = window.setInterval(checkElementPresent, 1000);

// Checks for the div with the running track length
function checkElementPresent() {
    /*let TrackLengthElement = getTrackLengthElement();
    // If found:
    if (!!TrackLengthElement) {
        // Stop the process o check every 1s
        window.clearInterval(intervalID);
        // adds an observer everytime the track length changes
        // (So every time  new track is played)
        var observer = new MutationObserver(function(mutations) {
            // Each change : check if ad and silence tab if so.
            silentBrowserIfAd();
        });
        // starts observer (defined above)
        observer.observe(TrackLengthElement, {
            characterData: true,
            childList: true,
            subtree: true
        });
        // Warns background that the extension has initialised correctly.
        chrome.runtime.sendMessage({action: "initialised"});
    }*/
    let nowPlayingElements = getNowPlayingElements();
    // If found:
    if (nowPlayingElements.length > 0) {
        // Stop the process o check every 1s
        window.clearInterval(intervalID);
        // adds an observer everytime the track length changes
        // (So every time  new track is played)
        var observer = new MutationObserver(function(mutations) {
            // Each change : check if ad and silence tab if so.
            silentBrowserIfAd();
        });
        for (let element of nowPlayingElements) {
            // starts observer (defined above)
            observer.observe(element, {
                characterData: true,
                childList: true,
                subtree: true
            });
        }
        // Warns background that the extension has initialised correctly.
        chrome.runtime.sendMessage({action: "initialised"});
    }
}

/**
 * Silences the tab if an ad is detected
 * (function to call every time the track length changes)
 */
function silentBrowserIfAd() {
    if (isAd()) {
        soundOff();
    } else {
        soundOn();
    }
}

/**
 * Finds and returns the div element of which the inner HTML contains the track length.
 * Null if not found.
 */
function getTrackLengthElement() {
    // The div is the second one in the document with the following class:
    let elements = document.querySelectorAll("div.playback-bar__progress-time");
    if (elements && elements.length > 1) {
        return elements[1];
    } else {
        // If not found, return null
        return null;
    }
}

/**
 * Finds and returns the div element of which the inner HTML contains the track length.
 * Null if not found.
 */
function getNowPlayingElements() {
    // The div is the second one in the document with the following class:
    return document.querySelectorAll("div.now-playing");
}

/**
 * Checks if the running track is an ad, by checking it length
 */
function isAd() {
    // check match "0:00" to "0:99"
    return elementsContainsAd() && !!getTrackLength().match(/0:[0-9][0-9]/);
}

/**
 * Gets the track length : inner HTML of the observed div
 */
function getTrackLength() {
    return getTrackLengthElement().innerHTML;
}

function elementsContainsAd() {
    let nowPlayingElements = getNowPlayingElements();
    for (let element of nowPlayingElements) {
        if (element.innerHTML.toLowerCase().includes('advertisement')
            || element.innerHTML.toLowerCase().includes('spotify')) {
            return true;
        }
    }
    return false;
}

function getTitle() {

}

/**
 * Tells the background to unmute the current tab
 */
function soundOn() {
    chrome.runtime.sendMessage({action: "soundOn"});
}

/**
 * Tells the background to mute the current tab
 */
function soundOff() {
    chrome.runtime.sendMessage({action: "soundOff"});
}