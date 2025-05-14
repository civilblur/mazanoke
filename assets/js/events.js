initApp();

function initApp() {
  // Initialize the app
  initI18n();
  initDropZone();
  initInputValidation();
  initClipboardPaste();
  initBackToTop();
  setConfigForm();
  restoreConfigForm();
}

function initDropZone() {
  const dropZone = ui.groups.dropZone;
  const fileInput = ui.inputs.file;
  const compressingGuard = (handler) => (e) => {
    // Prevent adding more to compression queue when isCompressing.
    if (state.isCompressing) return;
    handler(e);
  };  

  dropZone.addEventListener("click", compressingGuard(() => fileInput.click()));

  fileInput.addEventListener("change", compressingGuard((e) => {
    if (fileInput.files?.length) {
      compressImage(e);
      fileInput.value = "";
    }
  }));
  
  const toggleDragging = (add) => dropZone.classList.toggle("drop-zone--is-dragging", add);
  
  dropZone.addEventListener("dragenter", compressingGuard((e) => {
    e.preventDefault();
    toggleDragging(true);
  }));
  
  dropZone.addEventListener("dragover", compressingGuard((e) => {
    e.preventDefault();
    toggleDragging(true);
  }));
  
  dropZone.addEventListener("dragleave", compressingGuard((e) => {
    e.preventDefault();
    toggleDragging(false);
  }));
  
  dropZone.addEventListener("drop", compressingGuard((e) => {
    e.preventDefault();
    toggleDragging(false);
    if (e.dataTransfer.files?.length) {
      fileInput.files = e.dataTransfer.files;
      compressImage({ target: fileInput }, true);
      fileInput.value = "";
    }
  }));
}

function initInputValidation() {
  ui.inputs.quality.addEventListener("change", () => {
    setQuality(ui.inputs.quality.value);
  });
  
  ui.inputs.limitDimensions.addEventListener("change", (e) => {
    setLimitDimensions(ui.inputs.limitDimensions.value);
  });
  
  ui.inputs.limitWeight.addEventListener("change", (e) => {
    setWeight(ui.inputs.limitWeight.value, ui.inputs.limitWeightUnit.value);
  });
  
  ui.inputs.limitWeightUnit.addEventListener("change", (e) => {
    setWeightUnit(e.target.value);
  });
}

function initClipboardPaste() {
  document.addEventListener("paste", handlePasteImage);
}

function initBackToTop() {
  ui.actions.backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function setConfigForm() {
  // Default values of form fields, or for restoring local storage values.
  setQuality(config.form.quality.value);
  setLimitDimensions(config.form.limitDimensions.value);
  setWeightUnit(config.form.limitWeightUnit.value);
  setWeight(config.form.limitWeight.value, config.form.limitWeightUnit.value);
  setCompressMethod(config.form.compressMethod.value);
  setDimensionMethod(config.form.dimensionMethod.value);
  setConvertMethod(config.form.convertMethod.value);
}

function handlePasteImage(e) {
  if (!e.clipboardData || state.isCompressing) return;

  const items = e.clipboardData.items;
  const files = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.kind === "file" && item.type.startsWith("image/")) {
      files.push(item.getAsFile());
    }
  }

  if (files.length) {
    compressImage({ target: { files } });
  }
}

function abort(event) {
  // Cancel on-going compression.
  event.stopPropagation();
  if (!state.controller) return;
  resetCompressionState(false, true);
  state.controller.abort(new Error("Image compression cancelled"));
}

// Add click event to all language options
function setupLanguageOptions() {
  const langOptions = document.querySelectorAll('.language-selector__option');
  langOptions.forEach(option => {
    option.addEventListener('click', function(event) {
      event.preventDefault();
      const lang = this.getAttribute('data-lang');
      App.i18n.setLanguage(lang);
    });
  });
}

function initI18n() {
  App.i18n.init();

  initLanguageSelector();
  
  const langButton = ui.language.button;
  const langMenu = ui.language.selector;
  
  if (langButton && langMenu) {
    // Toggle language menu
    langButton.addEventListener('click', function() {
      langMenu.classList.toggle('language-selector__menu--active');
    });
    
    // Click other area to close dropdown menu
    document.addEventListener('click', function(event) {
      if (!langButton.contains(event.target) && !langMenu.contains(event.target)) {
        langMenu.classList.remove('language-selector__menu--active');
      }
    });
    
    setupLanguageOptions();
    
    // Listen to language selector content change, rebind event
    const observer = new MutationObserver(setupLanguageOptions);
    observer.observe(langMenu, { childList: true });
  }
}
