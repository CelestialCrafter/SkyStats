import * as axios from 'axios';

const getProfileStats = async (profileId, options) => {
	const response = await axios.get(
		`${options.hypixelBaseUrl}/skyblock/profile?key=${options.apikey}&profile=${profileId}`
	);
	return response.data;
};

export default getProfileStats;
