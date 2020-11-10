const P = require("parsimmon");
const ExpressionParser = require("expr-eval").Parser;
const Exp = new ExpressionParser();
const numeral = require("numeral");

function explainDecimal(d) {
    const adjustedFormatString = d.replace(/\d/g, "0");
    const formatString = adjustedFormatString.match(/^0+$/)
	  ? "0,0"
	  : adjustedFormatString;
    return { value: numeral(d).value(), formatString: formatString };
}


function makeRange(x) {
    if (x.length > 1) {
	return {
	    formatString: x[0].formatString,
	    min: x[0].value,
	    max: x[1].value,
	    value: x[1].value - (x[1].value - x[0].value) / 2,
	};
    } else {
	return {
	    formatString: x[0].formatString,
	    min: 0,
	    max: x[0].value * 2,
	    value: x[0].value,
	};
    }
}


function makeSelect(x) {
    return {
	options:x,
	formatString: '0',
	min: 0,
	max: x.length - 1,
	value:0,
    };
}


function tidy(x) {
    if (x[0]==='math') {
	return {eval: (state) => {
	    let result = Exp.evaluate(x[1].language, state);
	    return result;
	}}
    }
    else if (x[0]==='range') {
	return makeRange(x[1]);
    }

    else if (x[0]==='select') {
	return makeSelect(x[1]);
    }

    else if (x[0]==='switch') {
	return makeSelect(x[1]);
    }    

    return {};
}


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
	    ...tidy(x[1][0]),
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

    // We need to create the state for all of the elements. Whenever
    // an element is changed, the whole state can change.
    
    let state = concatted.reduce(function (obj, value) {
	if (value.type === "range") {
	    Object.assign(obj, { [value.name]: value.value });
	}
	else if (value.type === "select") {
	    Object.assign(obj, { [value.name]: value.options[0].string });
	}
	else if (value.type === "switch") {
	    Object.assign(obj, { [value.name]: value.options[0].string });
	}
	else if (value.type === "wiki") {
	    const k = value.name;
	    // Annoyingly, if it's a string that means it's a variable.
	    if (typeof value.value === 'string') {
		Object.assign(obj, { [k]: obj[value.value] });
	    }
	    else {
		Object.assign(obj, { [k]: value.value[0] });		
	    }

	} else if (value.type === "math") {
	    Object.assign(obj, {
		[value.name]: undefined
	    });
	}
	return obj;
    }, {});

    // Evaluate the mathematical expressions in the context of the
    // state.
    
    const mathed = concatted.filter((o) => o.type === "math");
    mathed.map((el) => {
	state[el.name] = el.eval(state);
	return true;
    });

    // That'll do it
    return {ast:concatted, astState:state};
}
    
export default parse;
