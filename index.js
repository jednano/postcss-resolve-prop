var t = require('tcomb-postcss');
var eachDecl = require('postcss-each-decl');

var Options = t.struct({
	parsers: t.maybe(t.Object)
}, 'Options');

module.exports = function(rule, prop, opts) {
	opts = opts || {};
	return (
		t.func([t.Rule, t.String, Options], t.maybe(t.String))
		.of(postcssResolveProp)(rule, prop, opts)
	);
};

function postcssResolveProp(rule, prop, opts) {

	var result;
	var parsers = opts.parsers || {};

	eachDecl(rule, function(decl) {
		var parse = t.maybe(t.Function)(parsers[decl.prop]);
		if (t.Function.is(parse)) {
			result = parse(decl.value);
			return;
		}
		if (decl.prop === prop) {
			result = decl.value;
		}
	});

	return result;
}
