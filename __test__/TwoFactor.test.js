'use strict';
import { expect } from '@jest/globals';
import { spyOn } from 'jest-mock';
import { TwoFactor, validateNumericInputs, focusElement } from '../TwoFactor.js';
describe('Two Factor', () => {
	const wrapper = document.createElement('div');
	const twoFactor = new TwoFactor(wrapper, 4);
	it('should render Two Factor', () => {
		expect(twoFactor).toBeTruthy();
		expect(wrapper.children[0].className).toBe('code');
	});

	it('should be false if input is not number', () => {
		const input = document.createElement('input');
		input.value = 'abcd';
		const inputInvalid = validateNumericInputs(input);
		expect(inputInvalid).toBe(false);
	});

	it('should be input value if input is number', () => {
		const input = document.createElement('input');
		input.value = 1;
		const inputValid = validateNumericInputs(input);
		expect(inputValid).toBe('1');
	});

	it('should be first digit input value', () => {
		const input = document.createElement('input');
		input.value = 234;
		const inputValid = validateNumericInputs(input);
		expect(inputValid).toBe('2');
	});

	it('should call focus and select from element', () => {
		const input = document.createElement('input');
		spyOn(input, 'focus');
		spyOn(input, 'select');
		focusElement(input);
		expect(input.focus).toHaveBeenCalled();
		expect(input.select).toHaveBeenCalled();
	});
});
