import React, { useState } from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
	flex: 1;
`;

const StyledDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const SelectName = (props) => {
	const [name, setName] = useState('');

	return (
		<StyledDiv>
			<h2>Whos Skyblock stats do you want to see?</h2>
			<StyledInput
				placeholder={props.placeholder ? props.placeholder : ''}
				onChange={(e) => setName(e.target.value)}
				onKeyPress={(e) => {
					if (e.key === 'Enter') props.onSelect(name);
				}}
			/>
		</StyledDiv>
	);
};

export default SelectName;
