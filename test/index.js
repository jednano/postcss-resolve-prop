var tape = require('tape');
var postcss = require('postcss');
var resolveProp = require('..');

tape('postcss-resolve-prop', function(t) {

	var rule = postcss.parse('a{foo:yes}').first;

	t.equal(
		resolveProp(rule, 'foo'),
		'yes',
		'it resolves a single declaration prop in a rule'
	);

	t.equal(
		resolveProp(rule, 'bar', { defaultValue: 'default' }),
		'default',
		'it uses the default value if no matching declaration is found'
	);

	rule = postcss.parse([
		'a {',
		'  foo: no;',
		'  foo: yes;',
		'}'
	].join('')).first;

	t.equal(
		resolveProp(rule, 'foo'),
		'yes',
		'it resolves the last declaration as the final value'
	);

	rule = postcss.parse([
		'a {',
		'  foo: no;',
		'  b {',
		'    foo: no;',
		'  }',
		'  @c {',
		'    foo: no;',
		'  }',
		'  foo: yes;',
		'}',
	].join('')).first;

	t.equal(
		resolveProp(rule, 'foo'),
		'yes',
		'it ignores any nested rules or at-rules'
	);

	rule = postcss.parse('a{foo:baz}').first;

	t.equal(
		resolveProp(rule, 'foo-bar', {
			shorthandParser: function(value) {
				return {
					bar: value + '-qux'
				};
			}
		}),
		'baz-qux',
		'it resolves a shorthand prop if a parser is provided'
	);

	rule = postcss.parse([
		'a {',
		'  foo-bar: no;',
		'  foo: no;',
		'}',
	].join('')).first;

	t.equal(
		resolveProp(rule, 'foo-bar', {
			shorthandParser: function(value) {
				return {
					bar: 'yes'
				};
			}
		}),
		'yes',
		'overrides the full prop with the shorthand prop value, if provided last'
	);

	rule = postcss.parse([
		'a {',
		'  foo: no;',
		'  foo-bar: yes;',
		'}',
	].join('')).first;

	t.equal(
		resolveProp(rule, 'foo-bar', {
			shorthandParser: function(value) {
				return {
					bar: 'no'
				};
			}
		}),
		'yes',
		'overrides the shorhand property value with the full prop, if provided last'
	);

	t.end();
});
