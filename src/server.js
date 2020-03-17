const axios = require('axios');
const stats = new Map();

require('dotenv').config();

const config = {
	hypixelBaseUrl: 'https://api.hypixel.net',
	username: 'Distraxtions',
	uuid: 'c20ece2105c04ad2b1bc63708430f9f8',
	profileName: 'pear'
};

const skyblockAPI = {
	selectProfileId: require('./lib/selectProfileId'),
	getProfileStats: require('./lib/getProfileStats')
};

const init = async () => {
	try {
		const profileId = await skyblockAPI.selectProfileId(config.uuid, {
			hypixelBaseUrl: config.hypixelBaseUrl,
			profileName: config.profileName
		});
		const profile = await skyblockAPI.getProfileStats(profileId, {
			hypixelBaseUrl: config.hypixelBaseUrl
		});

		console.log(profile);
	} catch (e) {
		console.log(e);
	}
};

init();
