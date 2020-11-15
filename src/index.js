import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import parse from './parse';
import App from "./App";

function replaceStatementsWithElements() {

    // Look through the document for all text nodes. If you find a
    // statement of the form {{...}}, break out the statement into an
    // array. Insert a placeholder span with an ID, and return all the
    // expressions so that we can turn them into React components and
    // insert them into the live DOM.
    
    const EXP_REGEXP = /({{[^}]+}})/;
    const EXP_EXPRESSION = /{{([^}]+)}}/;
    const el = document.getElementsByTagName('body')[0];

    function textNodesUnder(el){
	var n;

	var a=[];

	var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
	// eslint-disable-next-line no-cond-assign
	while(n = walk.nextNode()) {
	    a.push(n);
	};

	return a;
    }

    // I have a lot of side effects
    let texts = textNodesUnder(el).filter((x)=>x.textContent.match(EXP_REGEXP));
    let i = 0;
    let expressions = [];

    texts.map((textNode)=>{
	let edited = [];
	let parent = textNode.parentNode;
	// const results = parent.innerHTML.split(EXP_REGEXP);
	const results = textNode.nodeValue.split(EXP_REGEXP);	
	results.map((x)=>{	    
	    if (x.match(EXP_REGEXP)) {
		const m = x.match(EXP_EXPRESSION);
		edited.push(`<span id="account-${i++}">[...]</span>`);
		expressions.push(m[1]);
	    }
	    else {
		edited.push(x);
	    }
	});
	const wrapperSpanNode = document.createElement("span");
	wrapperSpanNode.innerHTML = edited.join("");	    
	parent.replaceChild(wrapperSpanNode, textNode);	
    });

    return parse(expressions);
}

const ast = replaceStatementsWithElements();
const astState = ast.reduce((acc, cur) => {
    acc[cur.name] = 0;
    return acc;}, {});

ReactDOM.render(
    <App ast={ast} astState={astState}/>,
    document.createElement("div"));
