import * as axios from 'axios';

const getProfileStats = async (profileId, options) => {
	const response = await axios.get(
		`${options.hypixelBaseUrl}/skyblock/profile?key=${options.apiKey}&profile=${profileId}`
	);
	return response.data || new Error('API_DISABLED');
};

export default getProfileStats;
