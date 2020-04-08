import * as axios from 'axios';

const selectProfileId = async (uuid, options) => {
	const response = await axios.get(
		`${options.hypixelBaseUrl}/player?key=${options.apiKey}&uuid=${uuid}`
	);

	const profiles = Object.values(response.data.player.stats.SkyBlock.profiles);

	return (
		profiles.find(
			(profile) =>
				profile.cute_name.toLowerCase() === options.profileName.toLowerCase()
		).profile_id || new Error()
	);
};

export default selectProfileId;
