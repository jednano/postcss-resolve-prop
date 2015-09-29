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
		resolveProp(rule, 'bar'),
		void 0,
		'it returns null if no matching prop is found'
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
			parsers: {
				foo: function(value) {
					return value + '-qux';
				}
			}
		}),
		'baz-qux',
		'it resolves with a parser, if provided'
	);

	rule = postcss.parse([
		'a {',
		'  foo-bar: no;',
		'  foo: no;',
		'}',
	].join('')).first;

	t.equal(
		resolveProp(rule, 'foo-bar', {
			parsers: {
				foo: function(value) {
					return 'yes';
				}
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
			parsers: {
				foo: function(value) {
					return 'no';
				}
			}
		}),
		'yes',
		'overrides the shorhand property value with the full prop, if provided last'
	);

	t.test('options', testOptions);

	t.end();
});

function testOptions(t) {
	t.test('isObjectMode', testObjectMode);
	t.end();
}

function testObjectMode(t) {

	var rule = postcss.parse([
		'a {',
		'  foo-bar: a;',
		'  foo: b c;',
		'  foo-baz: d;',
		'}',
	].join('')).first;

	t.deepEqual(
		resolveProp(rule, 'foo', {
			isObjectMode: true,
			parsers: {
				foo: function(value) {
					var parts = value.split(/\s+/);
					return {
						bar: parts[0],
						baz: parts[1]
					};
				},
				'foo-bar': function(value) {
					return { bar: value };
				},
				'foo-baz': function(value) {
					return { baz: value };
				}
			}
		}),
		{
			bar: 'b',
			baz: 'd'
		},
		'accumulates objects'
	);

	t.end();
}
