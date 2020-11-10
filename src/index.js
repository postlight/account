import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import parse from './smarter-text';
import App from "./App";


function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

const EXP_REGEXP = /({{[^}]+}})/;
const EXP_EXPRESSION = /{{([^}]+)}}/;
const el = document.getElementsByTagName('body')[0];

let texts = textNodesUnder(el).filter((x)=>x.textContent.match(EXP_REGEXP));
let i = 0;
// I have a lot of side effects
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

const o = parse(expressions);
let d = document.createElement("div");
d.id = '__APP__';
document.documentElement.appendChild(d);

ReactDOM.render(<App {...o}/>, d);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
