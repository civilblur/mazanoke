const logDom = document.querySelector("#webWorkerLog");
const progressDom = document.querySelector("#webWorkerProgress");
const outputDownloadContainer = document.querySelector("#outputDownloadContainer");
const webWorkerAbort = document.getElementById("webWorkerAbort");

function compressImage(event, useWebWorker) {
  const file = event.target.files[0];
  setupPreview(file);

  const options = createCompressionOptions(useWebWorker, onProgress);

  // Show the abort button
  webWorkerAbort.classList.add("processing");

  convertImage(file)
    .then((convertedFile) => imageCompression(convertedFile, options))
    .then((output) => handleCompressionResult(file, output))
    .catch((error) => alert(error.message))
    .finally(() => {
      // Hide the abort button
      webWorkerAbort.classList.remove("processing");
    });

  function onProgress(p) {
    console.log("onProgress", p);
    progressDom.innerHTML = "(" + p + "%" + ")";
  }
}

function setupPreview(file) {
  document.getElementById("preview").src = URL.createObjectURL(file);
  logDom.innerHTML =
    "Source image size:" + (file.size / 1024 / 1024).toFixed(2) + "mb";
  imageCompression.getExifOrientation(file).then((o) =>
    console.log("ExifOrientation", o)
  );
  controller = typeof AbortController !== "undefined" && new AbortController();
}

function createCompressionOptions(useWebWorker, onProgress) {
  const options = {
    maxSizeMB: parseFloat(document.querySelector("#maxSizeMB").value),
    maxWidthOrHeight: parseFloat(
      document.querySelector("#maxWidthOrHeight").value
    ),
    useWebWorker: useWebWorker,
    onProgress,
    preserveExif: true,
    libURL: "./browser-image-compression.js",
    initialQuality: 1,
  };
  if (controller) {
    options.signal = controller.signal;
  }
  return options;
}

function handleCompressionResult(file, output) {
  let imageExtension;
  const selectedFormat = document.getElementById("formatSelect").value;
  if (selectedFormat) {
    imageExtension = selectedFormat.replace("image/", "");
  } else {
    imageExtension = file.type.replace("image/", "");
  }

  const outputFilename = updateFileExtension(file.name, selectedFormat);

  const outputSizeText = document.createElement("div");
  outputSizeText.textContent =
    file.name + " (" + (output.size / 1024 / 1024).toFixed(2) + "mb)";

  const formatSpan = document.createElement("span");
  formatSpan.className = `file-format file-format--${imageExtension}`;
  formatSpan.textContent = imageExtension;
  outputSizeText.appendChild(formatSpan);

  const downloadLink = URL.createObjectURL(output);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = downloadLink;
  downloadAnchor.download = outputFilename;
  downloadAnchor.textContent = "download image";

  const outputItem = document.createElement("div");
  outputItem.appendChild(outputSizeText);
  outputItem.appendChild(document.createTextNode(" "));
  outputItem.appendChild(downloadAnchor);

  outputDownloadContainer.prepend(outputItem);
  document.getElementById("previewAfterCompress").src = downloadLink;

  return uploadToServer(output);
}

function updateFileExtension(originalName, format) {
  // Derive .jpg, .png, or .webp from selected format
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  let extension = "jpg";
  if (format === "image/png") extension = "png";
  if (format === "image/webp") extension = "webp";
  return baseName + "." + extension;
}

function convertImage(originalBlob, outputFormat, quality) {
  // Naive method of converting image; this does not preserve exif data.
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(originalBlob);
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(outputFormat, quality);
      fetch(dataURL)
        .then((res) => res.blob())
        .then((convertedBlob) => resolve(convertedBlob))
        .catch((err) => reject(err));
    };
    img.onerror = function (err) {
      reject(err);
    };
  });
}

function abort() {
  if (!controller) return;
  controller.abort(new Error("Image compression is aborted"));
}

function uploadToServer(file) {
  // const formData = new FormData()
  // formData.append('image', file, file.name)
  // const url = 'http://localhost:3000/image-upload-api'
  // return fetch(url, {
  //   method: 'POST',
  //   body: formData
  // }).then(res => res.json())
  //   .then(body => console.log('got server response', body))
}

document.addEventListener("DOMContentLoaded", function () {
  const dropZone = document.getElementById("webWorkerDropZone");
  const fileInput = document.getElementById("webWorker");

  dropZone.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function (event) {
    if (fileInput.files && fileInput.files.length > 0) {
      compressImage(event, true);
    }
  });

  dropZone.addEventListener("dragenter", function (e) {
    e.preventDefault();
    dropZone.classList.add("drop-zone--is-dragging");
  });

  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.classList.add("drop-zone--is-dragging");
  });

  dropZone.addEventListener("dragleave", function (e) {
    e.preventDefault();
    dropZone.classList.remove("drop-zone--is-dragging");
  });

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropZone.classList.remove("drop-zone--is-dragging");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      compressImage({ target: fileInput }, true);
    }
  });

  toggleFields(); // Initialize field visibility based on the default selection
});

function toggleFields() {
  const method = document.getElementById("compressMethod").value;
  const maxSizeMBField = document.querySelector("label[for='maxSizeMB']");
  const initialQualityField = document.querySelector("label[for='initialQuality']");

  if (method === "maxSizeMB") {
    maxSizeMBField.classList.remove("hidden");
    initialQualityField.classList.add("hidden");
  } else {
    maxSizeMBField.classList.add("hidden");
    initialQualityField.classList.remove("hidden");
  }
}