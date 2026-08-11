export function injectCustomConfirm(message, onConfirm, onCancel) {
  const dialogId = 'custom-popup-dialog';
  let dialog = document.getElementById(dialogId);
  if (dialog) dialog.remove(); // Clear previous instance if any

  dialog = document.createElement('dialog');
  dialog.id = dialogId;
  dialog.innerHTML = `
    <div class="dialog-content">
      <p class="dialog-message"></p>
      <div class="dialog-actions">
        <button id="dialog-cancel-btn" class="btn btn-secondary">Cancel</button>
        <button id="dialog-confirm-btn" class="btn btn-primary">Confirm</button>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #${dialogId} {
      border: none;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 90%;
      width: 320px;
    }
    #${dialogId}::backdrop {
      background: rgba(0, 0, 0, 0.4);
    }
    .dialog-content { display: flex; flex-direction: column; gap: 16px; }
    .dialog-message { margin: 0; font-size: 14px; color: #333333; line-height: 1.5; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .btn {
      padding: 6px 12px; font-size: 13px; font-weight: 500; border-radius: 4px;
      cursor: pointer; border: 1px solid transparent; transition: background 0.2s;
    }
    .btn-secondary { background: #f3f4f6; color: #4b5563; border-color: #d1d5db; }
    .btn-secondary:hover { background: #e5e7eb; }
    .btn-primary { background: #2563eb; color: #ffffff; }
    .btn-primary:hover { background: #1d4ed8; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(dialog);
  dialog.querySelector('.dialog-message').textContent = message;

  const handleClose = (callback) => {
    dialog.close();
    dialog.remove();
    style.remove();
    if (typeof callback === 'function') callback();
  };

  dialog.querySelector('#dialog-confirm-btn').onclick = () => handleClose(onConfirm);
  dialog.querySelector('#dialog-cancel-btn').onclick = () => handleClose(onCancel);
  dialog.onclose = () => { dialog.remove(); style.remove(); };
  dialog.showModal();
}

// === Example Usage ===
// injectCustomConfirm(
//   "Are you sure you want to proceed with this extension action?",
//   () => console.log("User clicked Confirm!"),
//   () => console.log("User clicked Cancel!")
// );
