
// --------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------------------------------- //

// Offscreen Setup - ignore
// --------------------------------------------------------------------------------------------------------- //

const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

// A global promise to avoid concurrency issues
let creating;

// There can only be one offscreenDocument. So we create a helper function
// that returns a boolean indicating if a document is already active.
async function hasDocument() {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const matchedClients = await clients.matchAll();

  return matchedClients.some(
    (c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)
  );
}

async function setupOffscreenDocument(path) {
  //if we do not have a document, we are already setup and can skip
  if (!(await hasDocument())) {
    // create offscreen document
    if (creating) {
      await creating;
    } else {
      creating = chrome.offscreen.createDocument({
        url: path,
        reasons: [
          chrome.offscreen.Reason.GEOLOCATION ||
            chrome.offscreen.Reason.DOM_SCRAPING
        ],
        justification: 'add justification for geolocation use here'
      });

      await creating;
      creating = null;
    }
  }
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}


// --------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------------------------------- //

// Offscreen functions
// --------------------------------------------------------------------------------------------------------- //


/**
 * calls window.prompt
 *
 * @export
 * @param {*} promptMessage
 * @return {*}
 */
export async function offScreenPrompt(promptMessage) {
    await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

    const wsName = await chrome.runtime.sendMessage({
      type: 'prompt',
      target: 'offscreen',
      promptMessage: promptMessage
    });
    console.log({wsName})
    await closeOffscreenDocument();
    return wsName;
}

/**
 * calls window.confirm
 *
 * @export
 * @param {str} confirmMessage
 * @return {boolean} true / false
 */
export async function offScreenConfirm(confirmMessage) {
    await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

    const confirm = await chrome.runtime.sendMessage({
      type: 'confirm',
      target: 'offscreen',
      confirmMessage: confirmMessage
    });
    console.log({confirm})
    await closeOffscreenDocument();
    return confirm;
}
