/*eslint brace-style: 0, strict: 0 */
'use strict';
const lib = {
	color: require('color'),
	colorBlind: require('color-blind'),
	colorHarmony: require('color-harmony'),
	colorQuantize: require('color-quantize'),
	colorScheme: require('color-scheme'),
	colorStats: require('color-stats'),
	colorConverter: require('colorconverter'),
	colorName: require('colorname'),
	onecolor: require('onecolor')
};
const colorFunctionNames = {
	R: 'red',
	G: 'green',
	B: 'blue',
	H: 'hue',
	S: 'saturation',
	L: 'lightness'
};
const lightenDarkenValue = 0.2;
// see: http://en.wikipedia.org/wiki/Blend_modes
const combinationFunctions = {
	'Mix': function (v1, v2) {return (v1 + v2) / 2;},
	'Lighten 1': function (v1) {return v1 + lightenDarkenValue;},
	'Darken 1': function (v1) {return v1 - lightenDarkenValue;},
	'Lighten 2': function (v1, v2) {return v2 + lightenDarkenValue;},
	'Darken 2': function (v1, v2) {return v2 - lightenDarkenValue;},
	'Add': function (v1, v2) {return v1 + v2;},
	'Subtract': function (v1, v2) {return v1 - v2;},
	'Difference': function (v1, v2) {return v1 < v2 ? v2 - v1 : v1 - v2;},
	'Divide': function (v1, v2) {return v1 / v2;},
	'Multiply': function (v1, v2) {return v1 * v2;},
	'Screen': function (v1, v2) {return 1 - (1 - v1) * (1 - v2);},
	'Overlay': function (v1, v2) {return v1 < 0.5 ? 2 * v1 * v2 : 1 - (2 * (1 - v1) * (1 - v2));}
};

exports.lib = lib;

exports.getCombinationFunctionNames = function () {
	return Object.keys(combinationFunctions);
};

exports.getCssFormatTypes = function () {
	return ['hex', 'rgb', 'percent', 'hsl', 'hwb'];
};

/* convert a onecolor object to a css string */
exports.format = function (oneColorObject, formatType) {
	let type = 'hex';
	const formatTypes = exports.getCssFormatTypes();
	const index = formatTypes.indexOf(formatType);
	if (index >= 0) {
		type = formatTypes[index];
	}
	const colorObject = lib.color(oneColorObject.cssa());
	return colorObject[`${type}String`]();
};

exports.isBitOn = function (num, pos) {
	return ((num & Math.pow(2, pos)) >> pos) === 1;
};

exports.combineColors = function (color1, color2, colorSpace, flags, fn) {
	let i;
	let key;
	let fnName;
	let val;
	const oneColorArray = [colorSpace];
	if (typeof fn === 'string') {
		fn = combinationFunctions.hasOwnProperty(fn) ?
				combinationFunctions[fn] : function (v1) {return v1;};
	}
	for (i = 0; i < colorSpace.length; i++) {
		key = colorSpace.substr(i, 1);
		fnName = colorFunctionNames[key];
		if (flags[i]) {
			val = fn(color1[fnName](), color2[fnName]());
		} else {
			val = color1[fnName]();
		}
		val = parseFloat(val);
		if (Number.isNaN(val)) {
			val = 0;
		}
		val = Math.min(val, 1);
		val = Math.max(val, 0);
		oneColorArray.push(val);
	}
	return lib.onecolor(oneColorArray);
};
