import React from 'react';

import selectProfiles from '../lib/selectProfileId';
import getProfileStats from '../lib/getProfileStats';

import Loading from './Loading';
import Profile from './Profile';

const config = {
	hypixelBaseUrl: 'https://api.hypixel.net',
	uuid: 'd3d0bdba87e042328bd0f2b49fb88ecf',
	key: '7e98eead-440c-4ee5-a0d7-e1eeb34b227f'
};

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			profileData: {}
		};
	}

	componentDidMount() {
		selectProfiles(config.uuid, {
			hypixelBaseUrl: config.hypixelBaseUrl,
			profileName: config.profileName,
			apikey: config.key
		}).then((profiles) => {
			generateDropdownData(profiles);
		});
	}

	profileStats(profileId) {
		getProfileStats(profileId, {
			hypixelBaseUrl: config.hypixelBaseUrl,
			apikey: config.key
		}).then((profile) =>
			this.setState({
				isLoading: false,
				profileData: profile.profile
			})
		);
	}

	generateDropdownData(profiles) {
		const dropdownData = [];

		profiles.forEach((profile) => {
			dropdownData.push({
				name: profile,
				onclick: selectProfileId(config.uuid, {
					hypixelBaseUrl: config.hypixelBaseUrl,
					profileName: config.profileName,
					apikey: config.key
				})
			})
		});

	}

	render() {
		return (
			<div className={'App'}>
				{this.state.isLoading ? (
					<Loading />
				) : (
					<Dropdown data={[

					]} />
					<Profile profile={this.state.profileData} uuid={config.uuid} />
				)}
			</div>
		);
	}
}

export default App;
