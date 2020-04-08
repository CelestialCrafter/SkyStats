import React from 'react';
import Item from './Item';
import cuid from 'cuid';
import decodeInventoryData from '../lib/decodeInventoryData';

class Stats extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			armor: []
		};
	}

	componentDidMount() {
		decodeInventoryData(this.props.data.members[this.props.uuid].ender_chest_contents.data).then((data) => {
			this.setState({armor: data});
		});
	}

	render() {
		return (
			<React.Fragment>
				{this.state.armor.reverse().map((item) => (
					<Item key={cuid()} itemData={item} />
				))}
			</React.Fragment>
		);
	}
}

export default Stats;
