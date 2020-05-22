const P = require("parsimmon");

// const nerdamer = require('nerdamer/all');
var ExpressionParser = require("expr-eval").Parser;
var Exp = new ExpressionParser();
const numeral = require("numeral");

/*

The goal is to make an AST out of a tiny templating DSL so that
we can build interactive stories. For math we defer to one of
the standard parsing libraries for basic equations. Math.js is
vast but also was noticeably slow to load, so I went with
expr-eval.

let text = "If you had {10:apples_owned} and you gave me {0-10:apples_given}, you would have {=apples_owned - apples_given:apples_left}.";

let ast = docParser.Doc.tryParse(text);

// Which would give you ast back as...
[
	  { type: 'text', value: 'If you had ' },
	  { type: 'number', key: 'apples_owned', value: 10 },
	  { type: 'text', value: ' and you gave me ' },
	  { type: 'range', key: 'apples_given', value: { low: 0, high: 10 } },
	  { type: 'text', value: ', you would have ' },
	  {
	      type: 'math',
	      key: 'apples_left',
	      value: 'apples_owned - apples_given',
	      asFunction: [Calculator function from expr-eval]
	  },
	  { type: 'text', value: '.' }
]

*/

const makeStatement = function (parseResult, kind) {
  const [value, variable] = parseResult;
  return {
    type: "statement",
    format: kind,
    value: value,
    variable: variable,
  };
};

function explainDecimal(d) {
  const adjustedFormatString = d.replace(/\d/g, "0");
  const formatString = adjustedFormatString.match(/^0+$/)
    ? "0,0"
    : adjustedFormatString;

  return { value: numeral(d).value(), formatString: formatString };
}

// Add custom functions to Parser

// With compounding interest, calculate how many months it will take to reach a goal balance
// Given a start balance, a monthly investment, and an annual interest rate
// Also make it readable
Exp.functions.monthsToGoalBalanceViaCompoundInterest = function (
  startBalance,
  goalBalance,
  monthlyInvestment,
  annualReturn
) {
  // Coerce to Numbers
  var balance = Number(startBalance);
  var endBalance = Number(goalBalance);
  var monthlyAddition = Number(monthlyInvestment);
  var monthlyRate = Number(annualReturn) / 12 / 100;
  var monthsPassed = 0;
  while (balance < endBalance) {
    balance += balance * monthlyRate + monthlyAddition;
    monthsPassed++;
  }
  return monthsPassed;
};

// Same as above, but we don't know value yet
function makeExpression(parseResult, kind) {
  const [expression, variable] = parseResult;
  return {
    type: "expression",
    format: kind,
    expression: expression,
    value: undefined,
    variable: variable,
    eval: (state) => Exp.evaluate(expression, state),
  };
}

function makeRange(parseResult) {
  const x = parseResult;

  if (x.length > 1) {
    return {
      formatString: x[0].formatString,
      min: x[0].value,
      max: x[1].value,
      value: (x[1].value - x[0].value) / 2,
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
const docParser = P.createLanguage({
  // The .many() is important -- we're parsing into an array of any
  // sequence of these Parser matches. The parser isn't expecting
  // that; it wants hierarchy. Without that, the parser fails and
  // says (most often) that it was expecting EOF.

  Doc: (r) => P.alt(r.DecimalExpression, r.Statement, r.Text).many(),

  Statement: (r) =>
    P.alt(r.DollarStatement, r.PercentageStatement, r.DecimalStatement),

  PlainStatement: (r) => P.string("{").then(r.Pair).skip(P.string("}")),

  DecimalStatement: (r) =>
    r.PlainStatement.map((x) => makeStatement(x, "decimal")),

  DollarStatement: (r) =>
    P.string("$")
      .then(r.PlainStatement)
      .map((x) => makeStatement(x, "dollar")),

  PercentageStatement: (r) =>
    r.PlainStatement.skip(P.string("%")).map((x) =>
      makeStatement(x, "percentage")
    ),

  DollarExpression: (r) =>
    P.seq(P.string("$"), r.DecimalExpression).map((x) =>
      makeExpression(x, "dollar")
    ),

  PercentageExpression: (r) =>
    P.seq(r.DecimalExpression, P.string("%")).map((x) =>
      makeExpression(x, "percentage")
    ),

  DecimalExpression: (r) =>
    r.PlainExpression.map((x) => makeExpression(x, "decimal")),

  PlainExpression: (r) => P.string("{=").then(r.MathPair).skip(P.string("}")),

  Pair: (r) => P.seq(r.Range.skip(P.string(":")), r.Variable),

  MathPair: (r) => P.seq(r.Math.skip(P.string(":")), r.Variable),

  Range: (r) => P.sepBy1(r.Decimal, P.string("-")).map(makeRange),

  Variable: (r) => P.regexp(/[a-z_]+/),

  Math: (r) => P.regexp(/[^:]+/),

  Decimal: (r) => P.regexp(/[+-]?[0-9.]+/).map(explainDecimal),

  Text: (r) =>
    P.alt(P.any, P.whitespace).map((x) => ({ type: "text", value: x })),
});

function parse(text) {
  const ast = docParser.Doc.tryParse(text);

  const concatted = ast.reduce((arr, el, i) => {
    if (el.type === "text") {
      const pos = arr.length - 1;
      if (arr[pos] && arr[pos].type === "text") {
        arr[pos].value = arr[pos].value + el.value;
        return arr;
      } else {
        return arr.concat(el);
      }
    }
    return arr.concat(el);
  }, []);

  let state = concatted.reduce(function (obj, value) {
    if (value.type === "statement") {
      Object.assign(obj, { [value.variable]: value.value.value });
    } else if (value.type === "expression") {
      Object.assign(obj, { [value.variable]: value.value });
    }
    return obj;
  }, {});

  const mathed = concatted.filter((o) => o.type === "expression");
  mathed.map((el) => {
    state[el.variable] = el.eval(state);
    return true;
  });
  return [concatted, state];
}

// var fs = require("fs");
// var text = fs.readFileSync("./texts/advertising.txt").toString();
// let x = parse(text);

export default parse;
