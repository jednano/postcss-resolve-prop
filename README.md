# postcss-resolve-prop

<img align="right" width="135" height="95"
	title="Philosopher’s stone, logo of PostCSS"
	src="http://postcss.github.io/postcss/logo-leftp.png">

[![NPM version](http://img.shields.io/npm/v/postcss-resolve-prop.svg?style=flat)](https://www.npmjs.org/package/postcss-resolve-prop)
[![npm license](http://img.shields.io/npm/l/postcss-resolve-prop.svg?style=flat-square)](https://www.npmjs.org/package/postcss-resolve-prop)
[![Travis Build Status](https://img.shields.io/travis/jedmao/postcss-resolve-prop.svg?label=unix)](https://travis-ci.org/jedmao/postcss-resolve-prop)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/jedmao/postcss-resolve-prop.svg?label=windows)](https://ci.appveyor.com/project/jedmao/postcss-resolve-prop)

[![npm](https://nodei.co/npm/postcss-resolve-prop.svg?downloads=true)](https://nodei.co/npm/postcss-resolve-prop/)

[PostCSS](https://github.com/postcss/postcss) helper method to resolve a rule's property value.

## Introduction

This project exposes a single function that simplifies the process of resolving a CSS rule's property value.

Given a CSS rule:

```css
a {
	color: red;
	color: blue;
}
```

Once parsed with PostCSS, you can request the value of the `color` property like so:

```js
var resolveProp = require('postcss-resolve-prop');
resolveProp(rule, 'color'); // blue
```

_Note: inherited properties are not supported at this time._

A more complicated example is when [shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) are used.

```css
a {
	border-color: red;
	border: 1px solid blue;
}
```

Let's get the `border-color`:

```js
resolveProp(rule, 'border-color', {
	defaultValue: 'black', // Note: varies from one browser to another
	shorthandParser: function(value) {
		return {
			color: postcss.list.space(value).pop() // Just a stupid example
		};
	}
}); // blue
```

## Installation

```
$ npm install postcss-resolve-prop [--save[-dev]]
```

## Usage

```js
require('postcss-resolve-prop')(rule, prop[, options]);
```

### rule

See [`PostCSS#Rule`](https://github.com/postcss/postcss/blob/master/docs/api.md#rule-node).

### prop

See [`PostCSS#Declaration#prop`](https://github.com/postcss/postcss/blob/master/docs/api.md#declarationprop).

## Options

### defaultValue

Type: `string`<br>
Required: `false`<br>
Default: `undefined`

Refer to the CSS specification for what the default value should be for the property you are reading.

### shorthandParser

Type: `(value) => {}`<br>
Required: `false`<br>
Default: `undefined`

If provided, the shorthand property will be implied by the beginning of your `prop` arg. For example, if you provide a `prop` named `border-color`, then `border` is the implied shorthand prop.

The function you provide takes in the shorthand property value and should return a plain JavaScript object where the keys map to CSS properties without the prefix.
