const axios = require('axios');

const getProfileStats = async (profileId, options) => {
	const response = await axios.get(
		`${options.hypixelBaseUrl}/skyblock/profile?key=${process.env.APIKEY}&profile=${profileId}`
	);
	return response.data;
};

module.exports = getProfileStats;
