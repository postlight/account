import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
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
	var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
	while(n=walk.nextNode()) a.push(n);
	return a;
    }

    // I have a lot of side effects
    let texts = textNodesUnder(el).filter((x)=>x.textContent.match(EXP_REGEXP));
    let i = 0;
    let expressions = [];
    
    texts.map((text)=>{
	let edited = [];
	let parent = text.parentNode;
	const results = parent.innerHTML.split(EXP_REGEXP);
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
	parent.innerHTML = edited.join("");
    });

    return parse(expressions);
}


const ast = replaceStatementsWithElements();
const astState = ast.reduce((acc, cur) => {
    acc[cur.name] = 0;
    return acc;}, {})
	   
// Drop an <App> into the React tree. We're just using this to
// coordinate the insertion of React components into the DOM.
let fakeAppSpan = document.createElement("span");
fakeAppSpan.id = '__APP__';
document.documentElement.appendChild(fakeAppSpan);

ReactDOM.render(<App ast={ast} astState={astState}/>, fakeAppSpan);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
