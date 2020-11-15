const P = require("parsimmon");
const numeral = require("numeral");

function explainDecimal(d) {
    const adjustedFormatString = d.replace(/\d/g, "0");
    const formatString = adjustedFormatString.match(/^0+$/)
	  ? "0,0"
	  : adjustedFormatString;
    return { value: numeral(d).value(), formatString: formatString };
}

// eslint-disable-next-line no-unused-vars
function debug(...x) {
    console.log('[DEBUG]', x);
    return x;
}

const unescape = (s) => {
    return s.replace(/\\/g, '');
}

const docParser = P.createLanguage({
    Expression: (r) => P.seq(
	r.Assignment,
	r.Pair.sepBy(r.comma))
	.map(x=>({
	    ...x[0],
	    type:x[1][0][0],
	    value:x[1][0][1],
	    qualifiers:Object.fromEntries(x[1].slice(1))
	})),
    
    Assignment: (r) => P.seq(
	r.Name.times(0,1),
	r.equals)
	.map(x=>({name:x[0][0]})),

    Pair: (r) => P.seq(
	r.Name
	    .skip(P.string(':')),
	r.Atom)
	.map(x=>[x[0],x[1]]),
    
    Atom: (r) => P.alt(
	r.Pair,
	r.String,
	r.List,
	r.Language,
	r.Name,
	r.Decimal),

    Name: (r) => P.regexp(/[a-zA-Z_]+/),

    String: (r) => P.regexp(/((?:.(?!(?<![\\])[']))*.?)/) // sorry
	.trim(P.optWhitespace)
	.wrap(P.string("'"),
	      P.string("'"))    
	.map(x=>({string:unescape(x)})),

    Language: (r) => P.seq(P.regexp(/\(.+\)/)
			   .lookahead(P.alt(r.comma, P.eof)))
	.map(x=>({language:x[0]})),

    Decimal: (r) => P.regexp(/[+-]?[0-9.]+/)
	.map(explainDecimal),
    
    List: (r) => P.sepBy(r.Atom, r.comma)
	.trim(P.optWhitespace)
	.wrap(P.string("["),
	      P.string("]")),

    equals: (r)=>P.optWhitespace.then(P.string('=').then(P.optWhitespace)),
    
    comma: (r)=>P.string(',').then(P.optWhitespace)
});

function parse(expressions) {
    const concatted = expressions.map((x)=>{
	return docParser.Expression.tryParse(x);
    });

    return concatted;
}
    
export default parse;
