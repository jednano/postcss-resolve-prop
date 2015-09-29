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
	font-size: 1rem;
	font: 1.2rem serif;
}
```

Let's get the `font-size`:

```js
resolveProp(rule, 'font-size', {
	parsers: {
		font: function(value) {
			return require('parse-css-font')(value).size;
		}
	}
}); // 1.2rem
```

If no value can be resolved, `null` will be returned.

## Installation

```
$ npm install postcss-resolve-prop [--save[-dev]]
```

## Usage

```js
require('postcss-resolve-prop')(rule, prop[, options]);
```

### rule

The rule you wish to read. See [`PostCSS#Rule`](https://github.com/postcss/postcss/blob/master/docs/api.md#rule-node).

### prop

The property you wish to read. See [`PostCSS#Declaration#prop`](https://github.com/postcss/postcss/blob/master/docs/api.md#declarationprop).

## Options

### isObjectMode

Type: `Boolean`<br>
Required: `false`<br>
Default: `undefined`

Accumulates parser result objects into a final result object.

### parsers

Type: `Object`<br>
Required: `false`<br>
Default: `undefined`

An object where the keys map to CSS properties and the values are functions that parse the declaration value into a result.

```js
{
	parser: function(value) {
		return require('parse-css-font')(value).size;
	}
}
```
