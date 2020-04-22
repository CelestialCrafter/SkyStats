import React from 'react';
import styled from 'styled-components';
import Stats from './Stats';

const H2 = styled.h2`
	font-family: 'Roboto', sans-serif;
`;

const Profile = (props) => {
	return (
		<div>
			<H2>Welcome Back {props.name}!</H2>
			<Stats data={props.data} uuid={props.uuid} />
		</div>
	);
};

export default Profile;
