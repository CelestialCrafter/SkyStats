import React, { useState } from 'react';
import styled from 'styled-components';

const A = styled.a`
	color: #e52b50;

	font-family: 'Roboto', sans-serif;
`;

const P = styled.p`
	font-family: 'Roboto', sans-serif;
`;

const APINotEnabled = (props) => {
	const [displayVideo, setDisplayVideo] = useState(false);
	return (
		<React.Fragment>
			<P>
				Your {props.type} API is not enabled! SkyStats relies on the API to show
				your stats!{' '}
				<A onClick={() => setDisplayVideo((prevDisplay) => !prevDisplay)}>
					How do I enable my API?
				</A>
			</P>
			<video
				src="https://sky.lea.moe/resources/video/enable_api.webm"
				autoPlay
				loop
				style={{
					display: displayVideo ? 'flex' : 'none',
					margin: '0 auto',
					zIndex: '3'
				}}
			></video>
		</React.Fragment>
	);
};

export default APINotEnabled;
