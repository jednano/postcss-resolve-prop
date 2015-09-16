var t = require('tcomb-postcss');
var eachDecl = require('postcss-each-decl');

var Options = t.struct({
	defaultValue: t.maybe(t.Str),
	shorthandParser: t.maybe(t.Func)
}, 'Options');

module.exports = function(rule, prop, opts) {
	opts = opts || {};
	return (
		t.func([t.Rule, t.Str, Options], t.maybe(t.Str))
		.of(postcssResolveProp)(rule, prop, opts)
	);
};

function postcssResolveProp(rule, prop, opts) {

	var result = opts.defaultValue;

	if (!t.Func.is(opts.shorthandParser)) {
		eachDecl(rule, function(decl) {
			if (decl.prop === prop) {
				result = decl.value;
			}
		});
		return result;
	}

	var parts = prop.split('-');
	var shorthandPrefix = parts.shift();
	var shorthandSuffix = parts.join('-');

	eachDecl(rule, function(decl) {
		if (decl.prop === shorthandPrefix) {
			result = opts.shorthandParser(decl.value)[shorthandSuffix];
		}
		if (decl.prop === prop) {
			result = decl.value;
		}
	});

	return result;
}
