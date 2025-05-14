window.App = window.App || {};

App.ui = {
  dialogs: {
    installPWA: document.getElementById("installPWADialog"),
    updateToast: document.getElementById("updateToast"),
    updateToastRefreshButton: document.getElementById("updateToastRefreshButton"),
  },
  inputs: {
    quality: document.getElementById("quality"),
    limitDimensions: document.getElementById("limitDimensions"),
    limitWeight: document.getElementById("limitWeight"),
    limitWeightUnit: document.getElementById("limitWeightUnit"),
    compressMethod: document.querySelectorAll('[name="compressMethod"]'),
    dimensionMethod: document.querySelectorAll('[name="dimensionMethod"]'),
    formatSelect: document.querySelectorAll('[name="formatSelect"]'),
    file: document.getElementById("compress"),
    settingsSubpage: document.querySelectorAll('[name="settingsSubpage"]'),
  },
  labels: {
    limitWeightSuffix: document.querySelector('label[for="limitWeight"][data-suffix]'),
  },
  progress: {
    container: document.querySelector(".progress-container"),
    queueCount: document.getElementById("compressProgressQueueCount"),
    track: document.getElementById("compressProgressTrack"),
    bar: document.getElementById("compressProgressBar"),
    text: document.getElementById("compressProgressText"),
  },
  output: {
    container: document.getElementById("outputDownloadContainer"),
    content: document.getElementById("outputDownloadContent"),
    downloadAllBtn: document.getElementById("downloadAllImagesButton"),
    subpageOutput: document.getElementById("subpageOutput"),
    imageCount: document.getElementById("compressedImageCount"),
    outputFileType: 'image/png',
  },
  actions: {
    abort: document.getElementById("compressAbort"),
    dropZone: document.getElementById("dropZoneActions"),
    backToTop: document.getElementById("backToTop"),
    downloadAll: document.getElementById("downloadAllImagesButton"),
  },
  groups: {
    formatMethod: document.getElementById("formatMethodGroup"),
    settingsSubpage: document.getElementById("selectSettingsSubpage"),
    dropZone: document.getElementById("compressDropZone"),
    limitWeight: document.getElementById("limitWeightField"),
    quality: document.getElementById("qualityField"),
    compressMethod: document.getElementById("compressMethodGroup"),
  },
  language: {
    selector: document.getElementById("languageSelector"),
    button: document.getElementById("languageSelectorButton"),
    currentLabel: document.getElementById("currentLanguage"),
  },
};

App.config = {
  form: {
    // Default form settings
    quality: {value: 80},
    limitDimensions: {value: 1200},
    limitWeightUnit: {value: "MB"},
    limitWeight: {value: 2},
    compressMethod: {value: "quality"},
    dimensionMethod: {value: "original"},
    convertMethod: {value: "default"},
  },
  thumbnailOptions: {
    initialQuality: 0.8,
    maxWidthOrHeight: 70,
    usecompress: true,
    preserveExif: false,
    fileType: "image/png",
    libURL: "./browser-image-compression.js",
    alwaysKeepResolution: true,
  },
  qualityLimit: {
    min: 0,
    max: 100,
  },
  weightLimit: {
    min: 0.01,
    max: 100,
  },
  dimensionLimit: {
    min: 1,
    max: 30000,
  },
};


App.state = {
  controller: null,
  compressQueue: [],
  compressQueueTotal: 0,
  compressProcessedCount: 0,
  compressMethod: null,
  isCompressing: false,
  isDownloadingAll: false,
  inputFileSize: null,
  outputImageCount: 0,
  fileProgressMap: {},
  limitWeightUnit: "MB",
};

const ui = App.ui;
const config = App.config;
const state = App.state;
zip = new JSZip();