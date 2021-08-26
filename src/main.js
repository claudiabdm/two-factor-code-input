'use strict';
import './styles/styles.css';
import './TwoFactor.css';
import { TwoFactor } from './TwoFactor.js';

// -------------------
// Create instances
// -------------------
const randomCode1 = generateRandomCode(4, 1);
const randomCode2 = generateRandomCode(6, 2);
const result1 = document.getElementById('result1');
const result2 = document.getElementById('result2');
const wrapper1 = document.getElementById('myTwoFactor');
const wrapper2 = document.getElementById('myOthertwoFactor');

const myTwoFactor = new TwoFactor(wrapper1, 4);
const myOtherTwoFactor = new TwoFactor(wrapper2, 6);

// -------------------
// Add custom submit
// -------------------
myTwoFactor.form.addEventListener('submit', submitCode(myTwoFactor, randomCode1, result1));
myOtherTwoFactor.form.addEventListener(
	'submit',
	submitCode(myOtherTwoFactor, randomCode2, result2)
);

function submitCode(twoFactorInstance, code, result) {
	return function handleSubmit(e) {
		e.preventDefault();
		let areInputsValid = true;
		let inputCode = '';
		for (let input of twoFactorInstance.inputs) {
			if (TwoFactor.validateNumericInput(input) === false) {
				areInputsValid = false;
			}
			inputCode += input.value;
			input.blur();
		}
		if (areInputsValid) {
			if (inputCode == code) {
				result.textContent = 'Submitted!';
				twoFactorInstance.form.reset();
			} else {
				result.textContent = 'Error: Code does not match';
				TwoFactor.focusElement(twoFactorInstance.inputs[0]);
			}
		} else {
			result.textContent = 'Error: Invalid inputs';
			TwoFactor.focusElement(twoFactorInstance.inputs[0]);
		}
	};
}

function generateRandomCode(totalDigits = 4, id) {
	const digitsStart = Math.pow(10, totalDigits - 1);
	const code = Math.floor(digitsStart + Math.random() * (digitsStart * 9));
	document.getElementById(`hint${id}`).textContent = `Hint: ${code}`;
	return code;
}
