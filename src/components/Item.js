import React from 'react';
import renderLore from '../lib/renderLore';
import renderTitle from '../lib/renderTitle';
import getTitleColor from '../lib/getTitleColor';
import styled from 'styled-components';

const StyledLore = styled.div`
	display: ${(props) => props.display};
	background-color: #212326;
	border-radius: 5px;
	padding: 15px;
	text-align: center;
	flex: 1;
`;

const StyledTitle = styled.div`
	display: ${(props) => props.display};
	background-color: ${(props) => props.color};
	border-radius: 5px;
	padding: 15px;
	text-align: center;
	flex: 1;
`;

class Item extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			display: false,
			showDefaultIcon: true,
			imageToDisplay: null
		};
	}

	getLore(item) {
		let output = '';
		const loreArray = item.display ? item.display.Lore : item.tag.display.Lore;

		loreArray.forEach((text) => {
			if (text === '') output += '\n';
			else output += text + '\n';
		});

		return renderLore(output);
	}

	getTitle(item) {
		const title = item.display ? item.display.Name : item.tag.display.Name;
		return renderTitle(title);
	}

	componentDidMount() {
		this.props.loreListener.on('close-all', (id) => {
			if (this.props.id !== id) this.setState({ display: false });
		});

		if (this.props.itemData.tag) {
			if (this.props.itemData.tag.SkullOwner) {
				const skinUrl = JSON.parse(
					atob(this.props.itemData.tag.SkullOwner.Properties.textures[0].Value)
				).textures.SKIN.url.replace(
					'textures.minecraft.net/texture',
					'sky.lea.moe/head'
				);

				this.setState({
					imageToDisplay: (
						<img
							onLoad={() => this.setState({ showDefaultIcon: false })}
							alt={this.props.itemData.tag.ExtraAttributes.id}
							src={skinUrl}
						/>
					)
				});
			}
		}
	}

	render() {
		return (
			<React.Fragment>
				{Object.keys(this.props.itemData)[0] ? (
					<React.Fragment>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								zIndex: 1
							}}
						>
							<div
								className={
									this.state.showDefaultIcon
										? `item-icon icon-${this.props.itemData.id}_${this.props.itemData.Damage}`
										: ''
								}
								onClick={() => {
									this.props.loreListener.emit('close-all', this.props.id);
									this.setState((prevState) => {
										return { display: !prevState.display };
									});
								}}
							>
								{this.state.imageToDisplay}
							</div>

							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									whiteSpace: 'nowrap',
									minWidth: '15%'
								}}
							>
								<StyledTitle
									color={getTitleColor(this.props.itemData)}
									display={this.state.display ? 'block' : 'none'}
									dangerouslySetInnerHTML={{
										__html: this.getTitle(this.props.itemData)
									}}
								></StyledTitle>
								<StyledLore
									display={this.state.display ? 'block' : 'none'}
									dangerouslySetInnerHTML={{
										__html: this.getLore(this.props.itemData)
									}}
								></StyledLore>
							</div>
						</div>
					</React.Fragment>
				) : (
					''
				)}
			</React.Fragment>
		);
	}
}

export default Item;
