import React from 'react';

import getProfiles from '../lib/getProfiles';
import selectProfileId from '../lib/selectProfileId';
import getProfileStats from '../lib/getProfileStats';

import Loading from './Loading';
import Menu from './Menu';
import Profile from './Profile';

class SelectUserProfile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			profileData: null
		};

		this.config = {
			hypixelBaseUrl: 'https://api.hypixel.net',
			key: '7e98eead-440c-4ee5-a0d7-e1eeb34b227f',
			uuid: props.uuid
		};
	}

	componentDidMount() {
		getProfiles(this.config.uuid, {
			hypixelBaseUrl: this.config.hypixelBaseUrl,
			profileName: this.config.profileName,
			apiKey: this.config.key
		}).then((profiles) => {
			this.setState({
				menuData: this.generateDropdownData(profiles),
				isLoading: false
			});
		});
	}

	profileStats(profileId) {
		getProfileStats(profileId, {
			hypixelBaseUrl: this.config.hypixelBaseUrl,
			apiKey: this.config.key
		}).then((profile) =>
			this.setState({
				isLoading: false,
				profileData: profile.profile
			})
		);
	}

	generateDropdownData(profiles) {
		const menuData = [];

		profiles.forEach((profile) => {
			menuData.push({
				name: profile,
				onClick: async () => {
					const profileId = await selectProfileId(this.config.uuid, {
						hypixelBaseUrl: this.config.hypixelBaseUrl,
						profileName: profile,
						apiKey: this.config.key
					});

					this.profileStats(profileId);
				}
			});
		});

		return menuData;
	}

	render() {
		return (
			<React.Fragment>
				{this.state.isLoading ? (
					<Loading />
				) : (
					<Menu data={this.state.menuData} title="Profiles" />
				)}
				{this.state.profileData ? (
					<Profile
						data={this.state.profileData}
						uuid={this.config.uuid}
						name={this.props.name}
					/>
				) : null}
			</React.Fragment>
		);
	}
}

export default SelectUserProfile;
