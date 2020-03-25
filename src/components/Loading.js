import React from 'react';

class Loading extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dotAmount: '.'
		};

		this.interval = null;
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			if (this.state.dotAmount.length === 10) this.setState({ dotAmount: '.' });
			else
				this.setState((prevState) => {
					return { dotAmount: prevState.dotAmount + '.' };
				});
		}, 250);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return <p>Loading{this.state.dotAmount}</p>;
	}
}

export default Loading;
