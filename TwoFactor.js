export { TwoFactor, validateNumericInputs, focusElement };

/**
 * Creates Two Factor input code component.
 * @constructor
 * @param {string} wrapper - The HTML element that will contain the component.
 * @param {number} totalDigits - The number of digits to input.
 */
function TwoFactor(wrapper, totalDigits) {
  this.wrapper = wrapper;
  this.totalDigits = totalDigits;
  this.form = null;
  this.inputs = [];
}

/**
 * Renders TwoFactor components.
 */
TwoFactor.prototype.render = function () {
  const inputsWrapper = createInputsWrapper.call(this, this.totalDigits);
  const submitButton = createSubmitButton();

  this.form = createForm();
  this.form.appendChild(inputsWrapper);
  this.form.appendChild(submitButton);
  this.wrapper.appendChild(this.form);

  addEvents.call(this);

  function createForm() {
    const form = document.createElement('form');
    form.classList.add('code');
    form.autocomplete = 'off';
    form.autocorrect = 'false';
    form.autocapitalize = 'false';
    return form;
  }

  function createInput(idx) {
    const input = document.createElement('input');
    input.classList.add('code__digit');
    input.type = 'number';
    input.maxlength = '1';
    input.ariaLabel = `Digit ${idx}`;
    input.ariaRequired = 'true';
    input.dataset.idx = idx;
    input.inputMode = 'numeric';
    return input;
  }

  function createInputsWrapper(totalDigits) {
    const digitsWrapper = document.createElement('div');
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.totalDigits; i++) {
      const input = createInput(i);
      this.inputs.push(input);
      fragment.appendChild(input);
    }
    digitsWrapper.classList.add('code__digits');
    digitsWrapper.style.setProperty('--total-digits', totalDigits);
    digitsWrapper.appendChild(fragment);
    return digitsWrapper;
  }

  function createSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.classList.add('code__button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.name = 'submitButton';
    return submitButton;
  }
};

/**
 * Add event listeners to form element.
 */
function addEvents() {
  this.form.addEventListener('input', checkInput(this));
  this.form.addEventListener('click', handleClickInput);
  this.form.addEventListener('paste', pasteCode(this));
  this.form.addEventListener('keydown', handleEventKeys);

  function checkInput(thisTwoFactor) {
    return function handleNumericInput(e) {
      const value = validateNumericInputs(e.target);
      if (value !== false) {
        e.target.value = value;
        focusNextInput.call(thisTwoFactor, e.target);
      } else {
        e.target.value = '';
      }
    };
  }

  function handleClickInput(e) {
    if (e.target.tagName == 'INPUT') {
      focusElement(e.target);
    }
  }

  function pasteCode(thisTwoFactor) {
    return function handleCopypase(e) {
      e.preventDefault(); // you can copy code in any input
      const copyCode = e.clipboardData.getData('text');
      for (let i = 0; i < thisTwoFactor.inputs.length; i++) {
        thisTwoFactor.inputs[i].value = copyCode[i];
        thisTwoFactor.inputs[i].focus();
      }
      setTimeout(() => {
        thisTwoFactor.form.elements['submitButton'].focus();
        for (let input of thisTwoFactor.inputs) {
          if (validateNumericInputs(input) === false) {
            focusElement(input);
            break;
          }
        }
      }, 0);
    };
  }

  function handleEventKeys(e) {
    handleArrowKeys(e);
    handleDelete(e);
  }

  function handleArrowKeys(e) {
    if (e.key == 'ArrowRight') {
      e.preventDefault();
      focusNextInput(e.target);
    }
    if (e.key == 'ArrowLeft') {
      e.preventDefault();
      focusPrevInput(e.target);
    }
  }

  function handleDelete(e) {
    if (e.key == 'Backspace') {
      e.target.value = '';
      e.target.classList.add('invalid');
      focusPrevInput(e.target);
    }
  }
}

/**
 * Validates that input is a number.
 * @param {HTMLInputElement} input  - HTML input.
 * @returns {(number | false)} - If input number returns value otherwise returns false.
 */
function validateNumericInputs(input) {
  if (isNaN(Number(input.value)) || input.value === '') {
    input.classList.add('invalid');
    return false;
  }
  input.classList.remove('invalid');
  return input.value.length > 1 ? input.value[0] : input.value;
};

/**
 * Focus and select input value.
 * @param {Element} elem  - HTML element.
 */
function focusElement(elem) {
  elem.focus();
  elem.select();
};

/**
 * Focus next input sibling.
 * * @param {HTMLInputElement} - Current input
 */
function focusNextInput(currentInput) {
  if (currentInput.nextElementSibling) {
    focusElement(currentInput.nextElementSibling);
  }
}

/**
 * Focus previus input sibling.
 * @param {HTMLInputElement} - Current input
 */
function focusPrevInput(currentInput) {
  if (currentInput.previousElementSibling) {
    focusElement(currentInput.previousElementSibling);
  }
}
