import React, { useState, useCallback, useEffect } from "react";
import _ from "lodash";
import "./Embed.css";

const PREFIX='https://en.wikipedia.org/api/rest_v1/page/summary/';

function Embed(props) {
    const [preview, setPreview] = useState(undefined);

    const fetchPreview = (ref) => {
	const url = `${PREFIX}${ref}`;
	console.log('[FETCH]', url)
	fetch(url,
	      {redirect:'follow',
	       cache: "force-cache"})
	    .then(response => {
		if (!response.bodyUsed) {
		    return response.json();
		}
	    })
	    .then(
		data=>setPreview(data)
	    );
	return undefined;
    }

    const debouncedFetch = useCallback(_.debounce(fetchPreview, 300), []);
    
    useEffect(() => {
	if (props.referenceValue) {
	    debouncedFetch(props.referenceValue);
	}
    }, [props.referenceValue]);
    

    return (
	<div key={props.value.string} className="embed">
	    {console.log(preview)}
	    <br/>
	    {preview && preview.thumbnail ? (
		<div>
		    <a href={preview.content_urls.desktop.page}>
			<img src={preview.thumbnail.source} alt={`Preview of ${props.value.string}`}/>
		    </a>
		    <div dangerouslySetInnerHTML={{__html:preview.extract_html}}/>
		</div>

	    ) : ''}
	</div>
    );
}

export default Embed;
