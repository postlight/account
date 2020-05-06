import 'util';
import parse from './smarter-text';
import React, {useState} from 'react';
import HamburgerMenu from 'react-hamburger-menu';
import './App.css';
import Section from './Section';
import { useParams, Link} from 'react-router-dom';

// Boilerplate for hacking in a webpack loader
const webpackTextLoader = require.context(
    '!raw-loader!./texts', false, /\.txt$/);

const textFiles = webpackTextLoader
      .keys()
      .map(filename => {
	  return {
	      filename:filename,
	      text:webpackTextLoader(filename).default
	  }});

// Just the filenames
function cleanFSInfo(k) {
    const r = k.replace(/^\.\/(.+).txt$/, '$1');
    return r;
}

const textVars = textFiles.reduce(
    (m, t) => ({...m,
		[cleanFSInfo(t.filename)]: parse(t.text)}),
    {});

function App(props) {
    let { page } = useParams();
    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    function makeLink(k,i) {
	return <div className="navEl" key={i}>
		   <Link to={'/'+k}
			 onClick={() => {
			     setHamburgerOpen(false)}}	
		      className="navEl"
		   >{k}</Link>
	       </div>
    }

    const [ast, astState] = textVars[page];
    
    return <div className="App">
	       <div className="burger">
		   <HamburgerMenu
		       isOpen={hamburgerOpen}
		       menuClicked={()=>
			   setHamburgerOpen(
			       hamburgerOpen
				   ? false
				   : true)}
		       width={80}
		       height={50}
		       strokeWidth={3}
		       rotate={45}
		       animationDuration={0.2}
		       className="burger"
		       color="slategray"/>
	       </div>
	       <div id="nav"
		    key="nav"
		    className={'hamburger-'+hamburgerOpen}>
		   {[Object.keys(textVars).map(makeLink)]}
		   <div id="footer">
		       <p>A <a href="https://postlight.com/labs">Postlight Labs Mini-labs Weekend project</a> by <a href="https://twitter.com/ftrain">Paul Ford</a>.</p>

		       <p><a href="https://github.com/postlight/account">Get the code</a>, it's open source.</p>
		   </div>
	       </div>
    	       <Section
		   ast={ast}
		   astState={astState}
		   page={page}/>

	   </div>;
    
}

export default App;
