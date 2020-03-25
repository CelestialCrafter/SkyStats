import * as axios from 'axios';

const selectProfileId = async (uuid, options) => {
	const response = await axios.get(
		`${options.hypixelBaseUrl}/player?key=${options.apikey}&uuid=${uuid}`
	);

	const profiles = Object.values(response.data.player.stats.SkyBlock.profiles);

	return profiles.find((profile) => profile.cute_name === options.profileName).profileId;
};

export default selectProfileId;
