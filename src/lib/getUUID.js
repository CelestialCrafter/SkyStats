import * as axios from 'axios';

const getUUID = async (name, options) => {
	const response = await axios.get(
		`${options.hypixelBaseUrl}/player?key=${options.apiKey}&name=${name}`
	);

	return response.data.player.uuid || new Error();
};

export default getUUID;
