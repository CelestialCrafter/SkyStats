import React, { useState } from 'react';
import SelectUserProfile from './SelectUserProfile';
import SelectName from './SelectName';
import getUUID from '../lib/getUUID';
import '../itemMap.css';

const App = () => {
	const [uuid, setUUID] = useState('');
	const [name, setName] = useState('');

	const config = {
		hypixelBaseUrl: 'https://api.hypixel.net',
		key: '7e98eead-440c-4ee5-a0d7-e1eeb34b227f'
	};

	const handleSelectName = (name) => {
		getUUID(name, {
			hypixelBaseUrl: config.hypixelBaseUrl,
			apiKey: config.key
		}).then((uuid) => {
			setUUID(uuid);
			setName(name);
		});
	};

	return (
		<React.Fragment>
			{uuid ? (
				<SelectUserProfile uuid={uuid} name={name} />
			) : (
				<SelectName onSelect={handleSelectName} placeholder="Username" />
			)}
		</React.Fragment>
	);
};

export default App;
