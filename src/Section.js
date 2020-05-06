import 'util';
import numeral from 'numeral';
import React, {useState, useEffect} from 'react';
import Slider from './Slider';
import Statement from './Statement';
import Text from './Text';

import './Section.css';

function Section(props) {
    const [state, setState] = useState(props.astState);
    const [ast, setAST] = useState(props.ast);

    useEffect(() => {
	setState(props.astState);
	setAST(props.ast);	
    }, [props.astState, props.ast]);
    
    function addField(k,v) {
	setState({...state, [k]:v});
	return v;
    }
    
    function toComponents(o, i) {
	switch (o.type) {
	    
	case 'text':
	    return <Text key={i} {...o}/>
	    
	case 'statement':
	    return <span className="full-statement" key={i}>
		       <Slider
			   key={o.variable}
			   addField={addField}
			   valueFromState={state[o.variable]}
			   i={i}
			   {...o}
		       />
		       <Statement
			   valueFromState={state[o.variable]}
			   i={i}
			   {...o}
		       />
		       
		   </span>
	    
	case 'expression':
	    function f(n) {
		const num = numeral(n);
		if (n < 10 && n > -10) {
		    return num.format('0.00');
		}
		return num.format('-0,0');
	    }

	    function calc(o) {
		const result = o.eval(state);
		if (result!==state[o.variable] && !isNaN(result)) {
		    addField(o.variable, result);
		}
		return result;
	    }
	    
	    return <span className="expression" key={i}>
		       {f(calc(o))}
		   </span>;
	    
	default:
	    return undefined;
	}
	    
    }

    return <div id="text">
	       <h1 key='h1'>{props.page}</h1>
	       {ast.map(toComponents)}
	   </div>;
    
}

export default Section;
