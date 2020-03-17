const axios = require('axios');

const selectProfileId = async (uuid, options) => {
	const response = await axios.get(
		`${options.hypixelBaseUrl}/player?key=${process.env.APIKEY}&uuid=${uuid}`
	);
	const profiles = Object.values(response.data.player.stats.SkyBlock.profiles);

	return profiles.find(
		(p) => p.cute_name.toLowerCase() === options.profileName.toLowerCase()
	).profile_id;
};

module.exports = selectProfileId;
