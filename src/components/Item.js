import React, { useState } from 'react';
import renderLore from '../lib/renderLore';

const Item = (props) => {
	const [display, setDisplay] = useState(false);

	let output = '';
	const loreArray = props.itemData.tag.display.Lore;

	loreArray.forEach((text) => {
		if (text === '') output += '\n';
		else output += text + '\n';
	});

	const lore = renderLore(output);

	return (
		<React.Fragment>
			{Object.keys(props.itemData)[0] ? (
				<React.Fragment>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							zIndex: 1
						}}
					>
						<div
							className={`item-icon icon-${props.itemData.id}_${props.itemData.Damage}`}
							onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
						></div>
					</div>

					<div
						style={{
							display: display ? 'inline-block' : 'none',
							backgroundColor: '#212326',
							borderRadius: '10px',
							padding: '15px',
							textAlign: 'center',
							position: 'absolute',
							zIndex: 2
						}}
						dangerouslySetInnerHTML={{ __html: lore }}
					></div>
				</React.Fragment>
			) : (
				''
			)}
		</React.Fragment>
	);
};

export default Item;
