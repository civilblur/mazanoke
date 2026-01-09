/**
 * Adding support for more image formats
 * =====================================
 * 1. Update accepted file types in the HTML input: `<input id="compress" type="file" accept="...">`.
 * 2. Register the new mime types in: `isFileTypeSupported()`, `mimeToExtension()`.  
 * 3. Preprocess to canvas-compatible blob in `preProcessImage()`, before compression `compressImageQueue()`.
 * 4. If the final output format, `selectedFormat`, is not JPG, WebP, or PNG, it needs to be encoded in `postProcessImage()`.
 * 5. If external libraries were used, they need to be included in `service-worker.js` to provide cached offline use.
 */

/**
 * TODO 2025-06-06: Refactor toast into reusable component, for showing e.g. "undo delete", error messages.
 * TODO 2025-06-06: Refactor deleteImage(), downloadAllImages(), to support "undo delete" with countdown.
 */

function compressImage(event) {
  // Entry point for image compression
  state.controller = new AbortController();
  state.compressQueue = Array.from(event.target.files);
  state.compressQueueTotal = state.compressQueue.length;
  state.compressProcessedCount = 0;
  state.fileProgressMap = {};
  state.isCompressing = true;
  
  document.body.classList.add("compressing--is-active");
  ui.actions.dropZone.classList.add("hidden");
  ui.actions.abort.classList.remove("hidden");
  ui.progress.container.classList.remove("hidden");
  ui.progress.text.innerHTML = `${App.i18n.getTranslation('process.preparing')}<span class="loading-dots">`;

  compressImageQueue();
}

async function compressImageQueue() {
  if (!state.compressQueue.length) {
    resetCompressionState(true);
    return;
  }

  const file = state.compressQueue[0];
  const i = state.compressProcessedCount;

  console.log('Input file: ', file);

  if (!isFileTypeSupported(file.type, file)) {
    console.error(`Unsupported file type: ${file.type}. Skipping "${file.name}".`);
    ui.progress.text.innerHTML = `Unsupported file "<div class='progress-file-name'>${file.name}</div>"`;
    state.compressQueue.shift();
    await compressImageQueue();
    return;
  }

  // Decode and parase image to validate options.
  const options = await createCompressionOptions((p) => currentProgress(p, i, file.name), file);
  // Preprocess image when needed (e.g., decoding or precompress image).
  const { preProcessedImage, preProcessedNewFileType } = await preProcessImage(file);
  const selectedFormat = getCheckedValue(ui.inputs.formatSelect)

  if (preProcessedImage) {
    options.fileType = preProcessedNewFileType;
  }
  if (isPostProcessingRequired(selectedFormat)) {
    options.fileType = 'image/png';
  }

  // Perform image compression
  lib.imageCompression((preProcessedImage || file), options)
    .then((compressedImage) =>
      getImageDimensions(compressedImage).then((dimensions) => ({
        image: compressedImage,
        ...dimensions,
      }))
    )
    .then(({ image, outputImageWidth, outputImageHeight }) =>
      generateThumbnailImage(image, { outputImageWidth, outputImageHeight })
    )
    .then(({ sourceImage, thumbnailImage, outputImageWidth, outputImageHeight }) =>
      // Postprocess image when needed (e.g., finalize by converting to the targeted file format)
      postProcessImage(sourceImage, selectedFormat, { outputImageWidth, outputImageHeight }).then(
        ({ postProcessedImage }) => ({
          postProcessedImage,
          thumbnailImage,
          outputImageWidth,
          outputImageHeight
        })
      )
    )
    .then(({ postProcessedImage, thumbnailImage, outputImageWidth, outputImageHeight }) =>
      handleCompressionResult(file, postProcessedImage, thumbnailImage, outputImageWidth, outputImageHeight)
    )
    .catch((error) => console.error(error.message))
    .finally(() => {
      state.compressProcessedCount++;
      state.compressQueue.shift();
      if (state.compressProcessedCount === 1) {
        selectSubpage("output");
      }
      resetCompressionState(state.compressProcessedCount === state.compressQueueTotal);
      if (state.compressProcessedCount < state.compressQueueTotal) {
        compressImageQueue();
      }
    });

  function currentProgress(p, index, fileName) {
    const overallProgress = calculateOverallProgress(
      state.fileProgressMap,
      state.compressQueueTotal
    );
    const fileNameShort =
      fileName.length > 15 ? fileName.slice(0, 12) + "..." : fileName;
    state.fileProgressMap[index] = p;

    ui.progress.queueCount.textContent = `${
      state.compressProcessedCount + 1
    } / ${state.compressQueueTotal}`;
    ui.progress.text.dataset.progress = overallProgress;
    ui.progress.text.innerHTML = `${App.i18n.getTranslation('process.optimizing')} "<div class='progress-file-name'>${fileName}</div>"`;
    ui.progress.bar.style.width = overallProgress + "%";
    console.log(`${App.i18n.getTranslation('process.optimizing')} "${fileNameShort}" (${overallProgress}%)`);

    if (p === 100 && state.compressProcessedCount === state.compressQueueTotal - 1) {
      ui.progress.text.innerHTML = `
        <div class="badge badge--success pt-2xs pb-2xs bg:surface">
          <div class="badge-text flex items-center gap-3xs">
            <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5303 6.53033L12.0607 6L11 4.93934L10.4697 5.46967L6.5 9.43934L5.53033 8.46967L5 7.93934L3.93934 9L4.46967 9.53033L5.96967 11.0303C6.26256 11.3232 6.73744 11.3232 7.03033 11.0303L11.5303 6.53033Z" fill="currentColor"></path></svg>
            <span>${App.i18n.getTranslation('process.done')}</span>
          </div>
        <div>
      `;
    }
  }
}

async function createCompressionOptions(currentProgress, file) {
  const compressMethod = getCheckedValue(ui.inputs.compressMethod);
  const dimensionMethod = getCheckedValue(ui.inputs.dimensionMethod);
  const maxWeight = getMaxWeight();
  const quality = Math.min(Math.max(parseFloat(ui.inputs.quality.value) / 100, 0), 1);
  let { inputFileType, selectedFormat } = getFileType(file);

  selectedFormat = resolveFinalFormat(inputFileType, selectedFormat);
  const limitDimensions = await getLimitDimensions(file, dimensionMethod);

  console.log("Input image file size: ", (file.size / 1024 / 1024).toFixed(3), "MB");

  const options = {
    maxSizeMB: compressMethod === "limitWeight" ? maxWeight : (file.size / 1024 / 1024).toFixed(3),
    initialQuality: compressMethod === "quality" ? quality : undefined,
    maxWidthOrHeight: dimensionMethod === "limit" ? limitDimensions : undefined,
    useWebWorker: true,
    onProgress: currentProgress,
    preserveExif: false,
    fileType: selectedFormat || undefined,
    libURL: "./browser-image-compression.js",
    alwaysKeepResolution: true,
  };
  if (state.controller) {
    options.signal = state.controller.signal;
  }

  console.log("Settings:", options);
  return options;
}

async function preProcessImage(file) {
  if (file.type === "image/heic" || file.type === "image/heif" || isHeicExt(file)) {
    return await preProcessHeic(file);
  }

  if (file.type === "image/avif") {
    return await preProcessAvif(file);
  }

  if (file.type === "image/vnd.microsoft.icon" || file.type === "image/x-icon") {
    return await preProcessIco(file);
  }

  if (file.type === "image/tiff" || file.type === "image/dng" || file.type === "image/x-adobe-dng") {
    return await preProcessTiff(file);
  }

  return { preProcessedImage: null, preProcessedNewFileType: null };
}

async function preProcessHeic(file) {
  console.log("Preprocessing HEIC image...");
  const image = await lib.heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.9,
  });
  return { preProcessedImage: image, preProcessedNewFileType: "image/jpeg" };
}

async function preProcessAvif(file) {
  console.log("Preprocessing AVIF image...");
  const image = await lib.imageCompression(file, config.avifPreProcessOptions);
  return { preProcessedImage: image, preProcessedNewFileType: "image/jpeg" };
}

async function preProcessIco(file) {
  const arrayBuffer = await file.arrayBuffer();
  if (!lib.icoJs.isICO(arrayBuffer)) {
    return { preProcessedImage: null, preProcessedNewFileType: null };
  }

  const parsedIco = await lib.icoJs.parseICO(arrayBuffer, "image/png");
  const rawImage = parsedIco[0];
  const blob = await decodeImageBufferToBlob(rawImage.buffer, "image/png", 1);
  return { preProcessedImage: blob, preProcessedNewFileType: "image/png" };
}

async function preProcessTiff(file) {
  const arrayBuffer = await file.arrayBuffer();
  const ifds = lib.utif.decode(arrayBuffer);
  lib.utif.decodeImage(arrayBuffer, ifds[0]);
  const rgba = lib.utif.toRGBA8(ifds[0]);
  const parsedTiff = await encodeImageRgbaToBlob(rgba, ifds[0].width, ifds[0].height, "image/png", 1);
  return { preProcessedImage: parsedTiff, preProcessedNewFileType: "image/png" };
}

async function postProcessImage(file, selectedFormat, dimensions) {
  console.log('Post-processing...');

  if (selectedFormat === "image/vnd.microsoft.icon" || selectedFormat === "image/x-icon") {
    // Convert the compressed image to ICO.
    file = await postProcessToIco(file);
  }
  return { postProcessedImage: file, ...dimensions };
}

async function postProcessToIco(pngFile) {
  const inputs = [{ png: pngFile, ignoreSize: true }];

  try {
    return await new lib.pngToIco().convertToBlobAsync(inputs, 'image/vnd.microsoft.icon');
  } catch (e) {
    console.error(e);
    const msg = e.message;
    if (msg) {
      alert("Error post-processing to ICO: " + (ErrorMessages[msg] ?? msg));
    }
  }
}

function decodeImageBufferToBlob(buffer, outputType = 'image/png', quality = 1) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((resultBlob) => {
        URL.revokeObjectURL(url);
        if (resultBlob) resolve(resultBlob);
        else reject(new Error('Failed to create blob'));
      }, outputType, quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

function encodeImageRgbaToBlob(rgba, width, height, outputType = 'image/png', quality = 1) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(new Uint8ClampedArray(rgba), width, height);
    ctx.putImageData(imageData, 0, 0);
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, outputType, quality);
  });
}

async function getLimitDimensions(file, dimensionMethod) {
  if (dimensionMethod !== "limit") return undefined;

  const limit = ui.inputs.limitDimensions.value;

  if (["image/heif", "image/heic"].includes(file.type) || isHeicExt(file)) {
    const buffer = await file.arrayBuffer();
    const img = new lib.libheif.HeifDecoder().decode(buffer)[0];
    return await getAdjustedDimensions({ width: img.get_width(), height: img.get_height() }, limit);
  }

  if (file.type === "image/tiff") {
    const buffer = await file.arrayBuffer();
    const ifds = lib.utif.decode(buffer);
    lib.utif.decodeImage(buffer, ifds[0]);
    return await getAdjustedDimensions({ width: ifds[0].width, height: ifds[0].height }, limit);
  }

  return await getAdjustedDimensions({ imageBlob: file }, limit);
}

function getMaxWeight() {
  const weight = parseFloat(ui.inputs.limitWeight.value);
  return ui.inputs.limitWeightUnit.value.toUpperCase() === "KB" ? weight / 1024 : weight;
}

function resolveFinalFormat(inputType, userFormat) {
  const fallback = ["image/jpeg", "image/png", "image/webp"];
  if (isPostProcessingRequired(userFormat)) {
    return fallback.includes(inputType) ? inputType : "image/png";
  }
  return userFormat;
}

async function generateThumbnailImage(file, dimensions) {
  const sourceImage = file;
  const thumbnailImage = await lib.imageCompression(file, config.thumbnailOptions);
  return { thumbnailImage, sourceImage, ...dimensions };
}

async function handleCompressionResult(file, output, thumbnailBlob, outputImageWidth, outputImageHeight) {
  const { outputFileExtension, selectedFormat } = getFileType(file);
  const outputImageBlob = URL.createObjectURL(output);

  const { renamedFileName, isBrowserDefaultFileName } = renameBrowserDefaultFileName(file.name);
  const outputFileNameText = updateFileExtension(
    isBrowserDefaultFileName ? renamedFileName : file.name,
    outputFileExtension,
    selectedFormat
  );

  const inputFileSize = parseFloat((file.size / 1024 / 1024).toFixed(3));
  const outputFileSize = parseFloat((output.size / 1024 / 1024).toFixed(3));
  const fileSizeSaved = inputFileSize - outputFileSize;
  const fileSizeSavedPercentage =
    inputFileSize > 0
      ? Math.abs(((fileSizeSaved / inputFileSize) * 100).toFixed(2))
      : "0";
  const fileSizeSavedTrend =
    fileSizeSaved < 0 ? "+" : fileSizeSaved > 0 ? "-" : "";
  const fileSizeSavedClass =
    fileSizeSaved <= 0 ? "badge--error" : "badge--success";

  const thumbnailDataURL = URL.createObjectURL(thumbnailBlob);

  const outputHTML = buildOutputItemHTML({
    outputImageBlob,
    thumbnailDataURL,
    outputFileNameText,
    outputFileExtension,
    width: outputImageWidth,
    height: outputImageHeight,
    fileSize: output.size,
    fileSizeSavedTrend,
    fileSizeSavedPercentage,
    fileSizeSavedClass,
  });

  const wrapper = document.createElement("div");
  wrapper.innerHTML = outputHTML.trim();
  ui.output.content.prepend(wrapper.firstChild);
  await updateImageCounter(1).then( () => updateOutputEmptyState());
}

function calculateOverallProgress(progressMap, totalFiles) {
  const sum = Object.values(progressMap).reduce((acc, val) => acc + val, 0);
  return Math.round(sum / totalFiles);
}

function resetCompressionState(isAllProcessed, aborted) {
  const resetState = () => {
    state.compressProcessedCount = 0;
    state.compressQueueTotal = 0;
    ui.progress.queueCount.textContent = "";
    state.compressQueue = [];
    state.isCompressing = false;
  };

  if (aborted) {
    resetUI();
    resetState();
    return;
  }

  if (isAllProcessed) {
    ui.actions.abort.classList.add("hidden");
    ui.progress.bar.style.width = "100%";

    setTimeout(() => {
      // Delay state reset to allow "Done" message to remain 
      resetUI();
      state.isCompressing = false;
    }, 1000);
    return;
  }

  if (state.isCompressing && state.compressProcessedCount === 0) {
    ui.progress.text.dataset.progress = 0;
    ui.progress.text.textContent = `${App.i18n.getTranslation('process.preparing')} 0%`;
    ui.progress.bar.style.width = "0%";
  }
}

