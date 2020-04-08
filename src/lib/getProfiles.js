import * as axios from 'axios';

const getProfiles = async (uuid, options) => {
	const response = await axios.get(
		`${options.hypixelBaseUrl}/player?key=${options.apiKey}&uuid=${uuid}`
	);

	const profiles = Object.values(response.data.player.stats.SkyBlock.profiles);

	return profiles.map((profile) => profile.cute_name) || new Error();
};

export default getProfiles;
