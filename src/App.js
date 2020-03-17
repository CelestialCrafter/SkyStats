import React, { useState } from 'react';
import { selectProfileId } from './lib/selectProfileId';
import { getProfileStats } from './lib/getProfileStats';

const config = {
	hypixelBaseUrl: 'https://api.hypixel.net',
	username: 'Distraxtions',
	uuid: 'c20ece2105c04ad2b1bc63708430f9f8',
	profileName: 'pear'
};

const App = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [profileData, setProfileData] = useState({});

	selectProfileId(config.uuid, {
		hypixelBaseUrl: config.hypixelBaseUrl,
		profileName: config.profileName
	}).then((profileId) => {
		getProfileStats(profileId, {
			hypixelBaseUrl: config.hypixelBaseUrl
		})
			.then((profile) => {
				setIsLoading(false);
				setProfileData(profile);
			});
	});

  return (
    <div className={'App'}>
      {isLoading ? <div><p>Loading...</p></div> : profileData}
    </div>
  );
};

export default App;
