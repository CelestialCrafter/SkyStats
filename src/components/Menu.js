import React, { useState } from 'react';
import cuid from 'cuid';
import styled, { keyframes, css } from 'styled-components';

const moveout = keyframes`
  from {
    transform: translateX(-100px);
  }

  to {
    transform: translateX(0px);
  }
`;

const Button = styled.button`
	border-radius: 8px;
	border: none;
	height: 30px;
	background-color: palevioletred;

	${(props) => props.css}
`;

const Dropdown = (props) => {
	const [display, setDisplay] = useState(false);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row'
			}}
		>
			<Button
				css={`
					z-index: 2;
				`}
				onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
			>
				{props.title}
			</Button>
			<div
				style={{
					listStyleType: 'none',
					display: display ? 'flex' : 'none'
				}}
			>
				{props.data.map((item) => (
					<Button
						css={css`
							animation: ${moveout} 0.1s linear;
							z-index: 1;
							background-color: #efefef;
						`}
						key={cuid()}
						onClick={item.onClick}
					>
						{item.name}
					</Button>
				))}
			</div>
			<Button>Stats</Button>
		</div>
	);
};

export default Dropdown;
