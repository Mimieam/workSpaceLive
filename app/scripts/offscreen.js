
// --------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------------------------------- //

// this is the script loaded by offscreen.html, it should be simple and fast. receive a cmd and handle it.
// --------------------------------------------------------------------------------------------------------- //


chrome.runtime.onMessage.addListener(handleMessages);

function handleMessages(message, sender, sendResponse) {
  // Return early if this message isn't meant for the offscreen document.
  if (message.target !== 'offscreen') {
    return false;
  }

  switch (message.type) {
    case 'prompt':
        sendResponse(prompt(message.promptMessage))
        break;
    case 'confirm':
        sendResponse(confirm(message.confirmMessage))
      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
      return false;
  }

  return true;
}
