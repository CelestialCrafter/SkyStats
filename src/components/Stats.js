import React from 'react';
import Item from './Item';
import cuid from 'cuid';
import decodeInventoryData from '../lib/decodeInventoryData';
import * as EventEmitter from 'events';

class Stats extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			rows: [],
			slots: []
		};
	}

	componentDidMount() {
		const listener = new EventEmitter();

		decodeInventoryData(
			this.props.data.members[this.props.uuid].inv_contents.data
		).then((data) => {
			this.setState({ items: data });

			for (let i = 0; i < 36; i++) {
				const itemData = this.state.items[i];
				const id = cuid();

				this.setState((prevState) => ({
					slots: [
						...prevState.slots,
						<StyledTd key={cuid()}>
							<Item
								key={id}
								id={id}
								itemData={itemData}
								loreListener={listener}
							/>
					</StyledTd>
					]
				}));
			}

			for (let i = 0; i < 4; i++) {

				this.setState((prevState) => {
					const slotsToShow = [];
					const fromSlot = prevState.rows.length * 9;
					const toSlot = fromSlot + 9;

					for (let i = fromSlot;i < toSlot;i++) {
						slotsToShow.push(this.state.slots[i]);
					}

					console.log(slotsToShow);
					console.log(fromSlot);
					console.log(toSlot);

					return {
						rows: [...prevState.rows, <tr key={cuid()}>{slotsToShow}</tr>]
					};
				});
			}

			//This is to put the hotbar at the bottom like in normal Minecraft
			this.setState(prevState => {
				const hotbar = prevState.rows[0];

				prevState.rows[0] = prevState.rows[4];
				prevState.rows[4] = hotbar;

				return prevState;
			})
		});
	}

	render() {
		return (
			<React.Fragment>
				<table>
					<tbody>
						{this.state.rows}
					</tbody>
				</table>
				{/*<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</table>*/}
			</React.Fragment>
		);
	}
}

export default Stats;
