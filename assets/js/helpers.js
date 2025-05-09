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
  
  // Get the download text of the current language
  const downloadText = App.i18n.getTranslation('output.download');
  
  return `
    <div class="image-output__item file-format--${outputFileExtension}" data-elevation="3">
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
      <a class="image-output__item-download-button button-cta button-secondary"
         data-filesize="${fileSize}"
         href="${outputImageBlob}"
         download="${outputFileNameText}">
        <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 1V1.75V8.68934L10.7197 6.71967L11.25 6.18934L12.3107 7.25L11.7803 7.78033L8.70711 10.8536C8.31658 11.2441 7.68342 11.2441 7.29289 10.8536L4.21967 7.78033L3.68934 7.25L4.75 6.18934L5.28033 6.71967L7.25 8.68934V1.75V1H8.75ZM13.5 9.25V13.5H2.5V9.25V8.5H1V9.25V14C1 14.5523 1.44771 15 2 15H14C14.5523 15 15 14.5523 15 14V9.25V8.5H13.5V9.25Z" fill="currentColor"></path></svg>
        <span class="xs:hidden">${downloadText}</span>
      </a>
    </div>
  `;
}