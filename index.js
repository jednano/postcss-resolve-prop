var t = require('tcomb-postcss');
var eachDecl = require('postcss-each-decl');
var assign = require('object-assign');

var Options = t.struct({
	isObjectMode: t.maybe(t.Boolean),
	parsers: t.maybe(t.Object)
}, 'Options');

var StrNum = t.union([t.String, t.Number]);
var Parser = t.func(t.String, t.Any);

module.exports = function(rule, prop, opts) {
	opts = opts || {};
	return (
		t.func([t.Rule, t.String, Options], t.Any)
		.of(postcssResolveProp)(rule, prop, opts)
	);
};

function postcssResolveProp(rule, prop, opts) {

	var result;
	var parsers = opts.parsers || {};

	if (opts.isObjectMode) {
		result = {};
		eachDecl(rule, function(decl) {
			var parse = t.maybe(Parser)(parsers[decl.prop]);
			if (Parser.is(parse)) {
				result = assign(result, parse(decl.value));
				return;
			}
			if (decl.prop === prop) {
				var partial = {};
				partial[decl.prop] = decl.value;
				result = assign(result, partial);
			}
		});
		return result;
	}

	eachDecl(rule, function(decl) {
		var parse = t.maybe(Parser)(parsers[decl.prop]);
		if (Parser.is(parse)) {
			result = parse(decl.value);
			return;
		}
		if (decl.prop === prop) {
			result = decl.value;
		}
	});

	return result;
}
