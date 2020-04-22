import { minecraft_formatting } from '../constants';

const getTitleColor = (item) => {
	const loreArray = item.display ? item.display.Lore : item.tag.display.Lore;
	const rarityRegex = loreArray[loreArray.length - 1]
		.toLowerCase()
		.match(/(legendary|epic|rare|uncommon|common)/);
	const rarity = rarityRegex ? rarityRegex[0] : null;

	let color = '';

	if (rarity === 'special') color = minecraft_formatting['d'];
	else if (rarity === 'legendary') color = minecraft_formatting[6];
	else if (rarity === 'epic') color = minecraft_formatting[5];
	else if (rarity === 'rare') color = minecraft_formatting[9];
	else if (rarity === 'uncommon') color = minecraft_formatting['a'];
	else if (rarity === 'common') color = minecraft_formatting[7];
	else color = minecraft_formatting[4];

	return color.color;
};

export default getTitleColor;
