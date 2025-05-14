/**
 * TODO:
 * - Refactor toast to reusable component to show error messages. 
 * - Allow clear individual items and all items.
 */

let storeConfigDebounceTimer;

function resetUI() {
  // Resets the UI primarily around the dropzone area.
  ui.actions.abort.classList.add("hidden");
  document.body.classList.remove("compressing--is-active");
  ui.actions.dropZone.classList.remove("hidden");
  ui.progress.container.classList.add("hidden");
  ui.progress.text.dataset.progress = 0;
  ui.progress.bar.style.width = "0%";
}

function storeConfigForm() {
  // Store form fields values to local storage.
  const configForm = {
    quality: ui.inputs.quality.value,
    limitDimensions: ui.inputs.limitDimensions.value,
    limitWeightUnit: ui.inputs.limitWeightUnit.value,
    limitWeight: ui.inputs.limitWeight.value,
    compressMethod: getCheckedValue(ui.inputs.compressMethod),
    dimensionMethod: getCheckedValue(ui.inputs.dimensionMethod),
    convertMethod: getCheckedValue(ui.inputs.formatSelect),
  };

  localStorage.setItem("configForm", JSON.stringify(configForm));
}

function storeConfigFormDebounce() {
  // Debounce the storage of form fields values to local storage, to prevent excessive.
  clearTimeout(storeConfigDebounceTimer);
  storeConfigDebounceTimer = setTimeout(() => {
    storeConfigForm();
  }, 300);
}

function restoreConfigForm() {
  // Restore form fields values from local storage.
  const configForm = JSON.parse(localStorage.getItem("configForm"));
  if (configForm) {
    setQuality(configForm.quality);
    setLimitDimensions(configForm.limitDimensions);
    setWeightUnit(configForm.limitWeightUnit);
    setWeight(configForm.limitWeight, configForm.limitWeightUnit);
    setCompressMethod(configForm.compressMethod);
    setDimensionMethod(configForm.dimensionMethod);
    setConvertMethod(configForm.convertMethod);
  }
}

function setCompressMethod(value) {
  // Form group: Optimization method.
  const compressMethod = value;

  document.querySelector(
    `input[name="compressMethod"][value="${compressMethod}"]`
  ).checked = true;

  document
    .querySelectorAll("#compressMethodGroup .button-card-radio")
    .forEach((el) => {
      el.classList.remove("button-card-radio--is-selected");
    });

  document
    .querySelector(
      `#compressMethodGroup input[name="compressMethod"][value="${compressMethod}"]`
    )
    .closest(".button-card-radio")
    .classList.add("button-card-radio--is-selected");

    if (compressMethod === "limitWeight") {
      ui.groups.limitWeight.classList.remove("hidden");
      ui.groups.quality.classList.add("hidden");
    }
    else {
      ui.groups.limitWeight.classList.add("hidden");
      ui.groups.quality.classList.remove("hidden");
    }

  storeConfigFormDebounce();
}

function setDimensionMethod(value) {
  // Form group: Dimensions method.
  document.querySelector(
    `input[name="dimensionMethod"][value="${value}"]`
  ).checked = true;
  document
    .querySelectorAll("#dimensionsMethodGroup .button-card-radio")
    .forEach((el) => {
      el.classList.remove("button-card-radio--is-selected");
    });
  document
    .querySelector(`input[name="dimensionMethod"][value="${value}"]`)
    .closest(".button-card-radio")
    .classList.add("button-card-radio--is-selected");

  const resizeDimensionsField = document.getElementById(
    "resizeDimensionsField"
  );
  if (value === "limit") {
    resizeDimensionsField.classList.remove("hidden");
  } else {
    resizeDimensionsField.classList.add("hidden");
  }

  storeConfigFormDebounce();
}

function setQuality(value) {
  // Form group: Quality.
  let quality = Number(value);
  const min = config.qualityLimit.min;
  const max = config.qualityLimit.max;
  if (quality > max) {
    quality = max;
    setSlider(max, "qualitySlider");
  }
  if (quality < min || isNaN(quality) || quality === "") {
    quality = min;
    setSlider(min, "qualitySlider");
  }
  else {
    quality = Math.round(quality);
    setSlider(quality, "qualitySlider");
  }

  ui.inputs.quality.value = quality;
  storeConfigFormDebounce();
}

function setSlider(value, sliderId) {
  // Form group: Slider.
  // Update input field and slider elements 
  const slider = document.getElementById(sliderId);
  const fill = slider.querySelector(".slider-fill");
  const thumb = slider.querySelector(".slider-thumb");
  let percentage = value;
  if (value < 0 || isNaN(value) || value === "") {
    percentage = 0;
  } else if (value > 100) {
    percentage = 100;
  }
  fill.style.width = percentage + "%";
  thumb.style.left = Math.min(percentage, 100) + "%";
}

function startSliderDrag(event, inputId) {
  const slider = event.currentTarget;
  const input = document.getElementById(inputId);

  const setSliderPosition = (e) => {
    const rect = slider.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);
    input.value = Math.round(Math.min(percentage, 100));
    setSlider(percentage, slider.id);
  };

  const onMouseMove = (e) => {
    setSliderPosition(e);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  setSliderPosition(event);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  storeConfigFormDebounce();
}

function setLimitDimensions(value) {
  // Form group: Limit dimensions.
  let selectedDimension = Number(value);
  const min = config.dimensionLimit.min;
  const max = config.dimensionLimit.max;
  if (selectedDimension > max) {
    selectedDimension = max;
  }
  else if (selectedDimension <= 0 || isNaN(selectedDimension) || selectedDimension === "") {
    selectedDimension = min;
  }
  else {
    selectedDimension = Math.round(selectedDimension);
  }

  ui.inputs.limitDimensions.value = selectedDimension;
  storeConfigFormDebounce();
}

function setConvertMethod(value) {
  // Form group: Convert to format.
  ui.inputs.formatSelect.forEach(input => {
    input.checked = input.value === value;
  });
  
  ui.groups.formatMethod.querySelectorAll(".button-card-radio").forEach(el => {
    el.classList.remove("button-card-radio--is-selected");
  });
  
  const selectedInput = Array.from(ui.inputs.formatSelect).find(input => input.value === value);
  if (selectedInput) {
    selectedInput.closest(".button-card-radio").classList.add("button-card-radio--is-selected");
  }

  storeConfigFormDebounce();
}

function setWeightUnit(value) {
  // Form group: Limit weight (unit)
  const previousUnit = state.limitWeightUnit.toUpperCase();
  if (previousUnit === value) return;

  Array.from(ui.inputs.limitWeightUnit.options).forEach(option => {
    option.selected = option.value === value;
  });

  if (previousUnit === "KB") {
    const kbToMb = Number(ui.inputs.limitWeight.value / 1000);
    if (kbToMb < ui.inputs.limitWeight.value) {
      ui.inputs.limitWeight.value = kbToMb;
      ui.inputs.limitWeight.step = 0.1;
    }
  }
  else if (previousUnit === "MB") {
    const mbToKb = Number(ui.inputs.limitWeight.value * 1000);
    if (mbToKb > ui.inputs.limitWeight.value) {
      ui.inputs.limitWeight.min = 0; 
      ui.inputs.limitWeight.step = 50;
      ui.inputs.limitWeight.value = mbToKb;
    }
  }

  state.limitWeightUnit = ui.inputs.limitWeightUnit.value.toUpperCase();
  ui.labels.limitWeightSuffix.textContent = ui.inputs.limitWeightUnit.value.toUpperCase();
  ui.labels.limitWeightSuffix.dataset.suffix = ui.inputs.limitWeightUnit.value.toUpperCase();

  storeConfigFormDebounce();
}

function setWeight(weight, unit) {
  // Form group: Limit weight
  const { value, message } = validateWeight(
    weight, unit
  );

  if (!value) {
  }
  else if (value && message) {
    ui.inputs.limitWeight.value = value;
  }
  else if (value) {
    ui.inputs.limitWeight.value = value;
  }

  ui.inputs.limitWeight.value = value;

  storeConfigFormDebounce();
}

function selectSubpage(value) {
  // Switch between "Settings", "Images".
  ui.inputs.settingsSubpage.forEach(input => {
    input.checked = input.value === value;
  });
  
  ui.groups.settingsSubpage.querySelectorAll(".segmented-control").forEach(el => {
    el.classList.remove("segmented-control--is-selected");
  });
  
  const selectedInput = Array.from(ui.inputs.settingsSubpage).find(input => input.value === value);
  if (selectedInput) {
    selectedInput.closest(".segmented-control").classList.add("segmented-control--is-selected");
  }
  
  document.body.className = document.body.className.replace(/\bsubpage--\S+/g, "");
  document.body.classList.add(`subpage--${value}`);

  storeConfigFormDebounce();
}

// Initialize language selector
function initLanguageSelector() {
  const languageSelector = ui.language.selector;
  
  if (languageSelector) {
    languageSelector.innerHTML = '';
    
    const languages = Object.keys(App.i18n.languageNames);
    
    languages.forEach(langCode => {
      const langName = App.i18n.languageNames[langCode];
      const isActive = langCode === App.i18n.currentLang;
      
      const option = document.createElement('a');
      option.href = 'javascript:void(0)';
      option.className = `language-selector__option${isActive ? ' language-selector__option--active' : ''}`;
      option.setAttribute('data-lang', langCode);
      option.textContent = langName;
      
      languageSelector.appendChild(option);
    });
  }
}

