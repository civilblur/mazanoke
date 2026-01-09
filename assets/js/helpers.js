function buildOutputItemHTML({
  outputImageBlob,
  thumbnailDataURL,
  outputFileNameText,
  outputFileExtension,
  width,
  height,
  fileSize,
  fileSizeSavedTrend,
  fileSizeSavedPercentage,
  fileSizeSavedClass,
}) {
  // Create the output dom for compressed images.
  const fileSizeInMB = fileSize / 1024 / 1024;
  let fileSizeDisplay;
  if (fileSizeInMB < 1) {
    fileSizeDisplay = Math.round(fileSizeInMB * 1024) + " KB";
  } else {
    fileSizeDisplay = fileSizeInMB.toFixed(2) + " MB";
  }
  const itemId = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  // Get the download text of the current language
  const downloadText = App.i18n.getTranslation('output.download');
  
  return `
    <div id="output_item__${itemId}" class="image-output__item file-format--${outputFileExtension} fade-in-up" data-elevation="3">
      <div class="image-output__item-tint fade-tint-in-out"></div>
      <img src="${thumbnailDataURL}" class="image-output__item-thumbnail" loading="lazy">
      <div class="image-output__item-text">
        <div class="image-output__item-filename">
          <span class="image-output__item-filename-start">${outputFileNameText.slice(0, -8)}</span>
          <span class="image-output__item-filename-end">${outputFileNameText.slice(-8)}</span>
        </div>
        <div class="image-output__item-dimensions">
          <div class="image-output__item-dimensions">${width}x${height}</div>
        </div>
      </div>
      <div class="image-output__item-stats">
        <span class="image-output__item-filesize" data-filesize="${fileSize}">${fileSizeDisplay}</span>
        <span class="image-output__item-filesize-saved badge ${fileSizeSavedClass}">
          <span class="badge-text">${fileSizeSavedTrend}${fileSizeSavedPercentage}%</span>
        </span>
        <span class="image-output__item-fileformat badge file-format--${outputFileExtension}">${outputFileExtension.toUpperCase()}</span>
      </div>
      <div class="flex gap-2xs"> 
        <a class="image-output__item-delete-button button-cta button-secondary minw-auto" onclick="deleteImage('output_item__${itemId}')">
          <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 2.75C6.75 2.05964 7.30964 1.5 8 1.5C8.69036 1.5 9.25 2.05964 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23122 6.48122 0 8 0C9.51878 0 10.75 1.23122 10.75 2.75V3H12.9201H14.25H15V4.5H14.25H13.8846L13.1776 13.6917C13.0774 14.9942 11.9913 16 10.6849 16H5.31508C4.00874 16 2.92263 14.9942 2.82244 13.6917L2.11538 4.5H1.75H1V3H1.75H3.07988H5.25ZM4.31802 13.5767L3.61982 4.5H12.3802L11.682 13.5767C11.6419 14.0977 11.2075 14.5 10.6849 14.5H5.31508C4.79254 14.5 4.3581 14.0977 4.31802 13.5767Z" fill="currentColor"></path></svg>
        </a>
        <a class="image-output__item-download-button button-cta button-secondary"
          data-filesize="${fileSize}"
          href="${outputImageBlob}"
          download="${outputFileNameText}">
          <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 1V1.75V8.68934L10.7197 6.71967L11.25 6.18934L12.3107 7.25L11.7803 7.78033L8.70711 10.8536C8.31658 11.2441 7.68342 11.2441 7.29289 10.8536L4.21967 7.78033L3.68934 7.25L4.75 6.18934L5.28033 6.71967L7.25 8.68934V1.75V1H8.75ZM13.5 9.25V13.5H2.5V9.25V8.5H1V9.25V14C1 14.5523 1.44771 15 2 15H14C14.5523 15 15 14.5523 15 14V9.25V8.5H13.5V9.25Z" fill="currentColor"></path></svg>
          <span class="xs:hidden">${downloadText}</span>
        </a>
      </div> 
    </div>
  `;
}

function updateImageCounter(count = 1, set = false) {
  // Chain the update on the existing promise to serialize calls
  state.outputImageCountLock = state.outputImageCountLock.then(() => {
    state.outputImageCount = set
      ? Math.max(0, count)
      : Math.max(0, state.outputImageCount + count);

    const countStr = state.outputImageCount.toString();
    ui.output.container.dataset.count = countStr;
    ui.output.subpageOutput.dataset.count = countStr;
    ui.output.imageCount.dataset.count = countStr;
    ui.output.imageCount.textContent = countStr;

    return state.outputImageCount;
  });

  return state.outputImageCountLock;
}

function updateOutputEmptyState() {
  const isEmpty = state.outputImageCount <= 0;
  const className = "is-active";

  if (isEmpty) {
    ui.output.emptyState.classList.add(className);
    ui.output.actionsContainer.classList.remove(className);
  } else {
    ui.output.emptyState.classList.remove(className);
    ui.output.actionsContainer.classList.add(className);
  }

  return isEmpty
}