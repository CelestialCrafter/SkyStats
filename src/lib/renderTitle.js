import { minecraft_formatting } from '../constants';

const renderLore = (text) => {
	let output = '';

	let spansOpened = 0;

	const parts = text.replace(/\n/g, '<br />').split('§');

	for (const part of parts) {
		const code = part.substring(0, 1);
		const content = part.substring(1);

		if (code in minecraft_formatting) {
			const format = minecraft_formatting[code];

			if (format.type === 'color') {
				for (; spansOpened > 0; spansOpened--) output += '</span>';

				output += `<span style="color: #FFFFFF;">${content}`;

				spansOpened++;
			} else if (format.type === 'format') {
				output += `<span style="${format.css}">${content}`;

				spansOpened++;
			} else if (format.type === 'reset') {
				for (; spansOpened > 0; spansOpened--) output += '</span>';

				output += content;
			}
		}
	}

	for (; spansOpened > 0; spansOpened--) output += '</span>';

	return output;
};

export default renderLore;
