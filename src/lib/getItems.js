import getId from './getId';
import decodeInventoryData from './decodeInventoryData';
import * as objectPath from 'objectPath';
import { talisman_upgrades, talisman_duplicates } from '../constants';

const rarity_order = [
	'special',
	'legendary',
	'epic',
	'rare',
	'uncommon',
	'common'
];

const getItems = async (profile) => {
	const output = {};

	// Process inventories returned by API
	let armor =
		'inv_armor' in profile ? await decodeInventoryData(profile.inv_armor.data) : [];
	let inventory =
		'inv_contents' in profile ? await decodeInventoryData(profile.inv_contents.data) : [];
	let enderchest =
		'ender_chest_contents' in profile
			? await decodeInventoryData(profile.ender_chest_contents.data)
			: [];
	let talisman_bag =
		'talisman_bag' in profile ? await decodeInventoryData(profile.talisman_bag.data) : [];
	let fishing_bag =
		'fishing_bag' in profile ? await decodeInventoryData(profile.fishing_bag.data) : [];
	let quiver = 'quiver' in profile ? await decodeInventoryData(profile.quiver.data) : [];
	let potion_bag =
		'potion_bag' in profile ? await decodeInventoryData(profile.potion_bag.data) : [];
	let candy_bag =
		'candy_inventory_contents' in profile
			? await decodeInventoryData(profile.candy_inventory_contents.data)
			: [];

	output.armor = armor.filter((a) => Object.keys(a).length !== 0);
	output.inventory = inventory;
	output.enderchest = enderchest;
	output.talisman_bag = talisman_bag;
	output.fishing_bag = fishing_bag;
	output.quiver = quiver;
	output.potion_bag = potion_bag;

	const all_items = armor.concat(
		inventory,
		enderchest,
		talisman_bag,
		fishing_bag,
		quiver,
		potion_bag
	);

	for (const [index, item] of all_items.entries()) {
		item.item_index = index;

		if ('containsItems' in item && Array.isArray(item.containsItems))
			item.containsItems.forEach((a) => (a.backpackIndex = item.item_index));
	}

	// All items not in the inventory or accessory bag should be inactive so they don't contribute to the total stats
	enderchest = enderchest.map((a) => Object.assign({ isInactive: true }, a));

	// Add candy bag contents as backpack contents to candy bag
	for (let item of all_items) {
		if (getId(item) === 'TRICK_OR_TREAT_BAG') item.containsItems = candy_bag;
	}

	const talismans = [];

	// Add talismans from inventory
	for (const talisman of inventory.filter((a) => a.type === 'accessory')) {
		const id = getId(talisman);

		if (id === null) continue;

		const insertTalisman = Object.assign(
			{ isUnique: true, isInactive: false },
			talisman
		);

		if (talismans.filter((a) => !a.isInactive && getId(a) === id).length > 0)
			insertTalisman.isInactive = true;

		if (talismans.filter((a) => a.tag.ExtraAttributes.id === id).length > 0)
			insertTalisman.isUnique = false;

		talismans.push(insertTalisman);
	}

	// Add talismans from accessory bag if not already in inventory
	for (const talisman of talisman_bag) {
		const id = getId(talisman);

		if (id === null) continue;

		const insertTalisman = Object.assign(
			{ isUnique: true, isInactive: false },
			talisman
		);

		if (talismans.filter((a) => !a.isInactive && getId(a) === id).length > 0)
			insertTalisman.isInactive = true;

		if (talismans.filter((a) => a.tag.ExtraAttributes.id === id).length > 0)
			insertTalisman.isUnique = false;

		talismans.push(insertTalisman);
	}

	// Add inactive talismans from enderchest and backpacks
	for (const item of inventory.concat(enderchest)) {
		let items = [item];

		if (
			item.type !== 'accessory' &&
			'containsItems' in item &&
			Array.isArray(item.containsItems)
		)
			items = item.containsItems.slice(0);

		for (const talisman of items.filter((a) => a.type === 'accessory')) {
			const id = talisman.tag.ExtraAttributes.id;

			const insertTalisman = Object.assign(
				{ isUnique: true, isInactive: true },
				talisman
			);

			if (talismans.filter((a) => getId(a) === id).length > 0)
				insertTalisman.isUnique = false;

			talismans.push(insertTalisman);
		}
	}

	// Don't account for lower tier versions of the same talisman
	for (const talisman of talismans) {
		const id = getId(talisman);

		if (id in talisman_upgrades) {
			const talismanUpgrades = talisman_upgrades[id];

			if (
				talismans.filter(
					(a) => !a.isInactive && talismanUpgrades.includes(getId(a))
				).length > 0
			)
				talisman.isInactive = true;

			if (
				talismans.filter((a) => talismanUpgrades.includes(getId(a))).length > 0
			)
				talisman.isUnique = false;
		}

		if (id in talisman_duplicates) {
			const talismanDuplicates = talisman_duplicates[id];

			if (
				talismans.filter((a) => talismanDuplicates.includes(getId(a))).length >
				0
			)
				talisman.isUnique = false;
		}
	}

	// Add New Year Cake Bag health bonus (1 per unique cake)
	for (let talisman of talismans) {
		let id = talisman.tag.ExtraAttributes.id;
		let cakes = [];

		if (
			id === 'NEW_YEAR_CAKE_BAG' &&
			objectPath.has(talisman, 'containsItems') &&
			Array.isArray(talisman.containsItems)
		) {
			talisman.stats.health = 0;

			for (let item of talisman.containsItems) {
				if (
					objectPath.has(item, 'tag.ExtraAttributes.new_years_cake') &&
					!cakes.includes(item.tag.ExtraAttributes.new_years_cake)
				) {
					talisman.stats.health++;
					cakes.push(item.tag.ExtraAttributes.new_years_cake);
				}
			}
		}
	}

	// Add base name without reforge
	for (const talisman of talismans) {
		talisman.base_name = talisman.display_name;

		if (objectPath.has(talisman, 'tag.ExtraAttributes.modifier')) {
			talisman.base_name = talisman.display_name
				.split(' ')
				.slice(1)
				.join(' ');
			talisman.reforge = talisman.tag.ExtraAttributes.modifier;
		}
	}

	output.talismans = talismans;
	output.weapons = all_items.filter(
		(a) => a.type === 'sword' || a.type === 'bow' || a.type === 'fishing rod'
	);

	for (const item of all_items) {
		if (!Array.isArray(item.containsItems)) continue;

		output.weapons.push(
			...item.containsItems.filter(
				(a) =>
					a.type === 'sword' || a.type === 'bow' || a.type === 'fishing rod'
			)
		);
	}

	// Check if inventory access disabled by user
	if (inventory.length === 0) output.no_inventory = true;

	// Sort talismans and weapons by rarity
	output.weapons = output.weapons.sort((a, b) => {
		if (a.rarity === b.rarity) {
			if (b.inBackpack) return -1;

			return a.item_index > b.item_index ? 1 : -1;
		}

		return rarity_order.indexOf(a.rarity) - rarity_order.indexOf(b.rarity);
	});

	const countsOfId = {};

	for (const weapon of output.weapons) {
		const id = getId(weapon);

		countsOfId[id] = (countsOfId[id] || 0) + 1;

		if (countsOfId[id] > 2) weapon.hidden = true;
	}

	output.talismans = output.talismans.sort((a, b) => {
		const rarityOrder =
			rarity_order.indexOf(a.rarity) - rarity_order.indexOf(b.rarity);

		if (rarityOrder === 0)
			return a.isInactive === b.isInactive ? 0 : a.isInactive ? 1 : -1;

		return rarityOrder;
	});

	let swords = output.weapons.filter((a) => a.type === 'sword');
	let bows = output.weapons.filter((a) => a.type === 'bow');

	let swordsInventory = swords.filter((a) => a.backpackIndex === undefined);
	let bowsInventory = bows.filter((a) => a.backpackIndex === undefined);

	if (swords.length > 0)
		output.highest_rarity_sword = swordsInventory
			.filter((a) => a.rarity === swordsInventory[0].rarity)
			.sort((a, b) => a.item_index - b.item_index)[0];

	if (bows.length > 0)
		output.highest_rarity_bow = bowsInventory
			.filter((a) => a.rarity === bowsInventory[0].rarity)
			.sort((a, b) => a.item_index - b.item_index)[0];

	if (armor.filter((a) => Object.keys(a).length > 1).length === 1) {
		const armorPiece = armor.filter((a) => Object.keys(a).length > 1)[0];

		output.armor_set = armorPiece.display_name;
		output.armor_set_rarity = armorPiece.rarity;
	}

	if (armor.filter((a) => Object.keys(a).length > 1).length === 4) {
		let output_name = '';
		let reforgeName;

		armor.forEach((armorPiece) => {
			let name = armorPiece.display_name;

			if (objectPath.has(armorPiece, 'tag.ExtraAttributes.modifier'))
				name = name
					.split(' ')
					.slice(1)
					.join(' ');

			armorPiece.armor_name = name;
		});

		if (
			armor.filter(
				(a) =>
					objectPath.has(a, 'tag.ExtraAttributes.modifier') &&
					a.tag.ExtraAttributes.modifier ===
						armor[0].tag.ExtraAttributes.modifier
			).length === 4
		)
			reforgeName = armor[0].display_name.split(' ')[0];

		const isMonsterSet =
			armor.filter((a) =>
				[
					'SKELETON_HELMET',
					'GUARDIAN_CHESTPLATE',
					'CREEPER_LEGGINGS',
					'SPIDER_BOOTS',
					'TARANTULA_BOOTS'
				].includes(getId(a))
			).length === 4;

		const isPerfectSet =
			armor.filter((a) => getId(a).startsWith('PERFECT_')).length === 4;

		if (
			armor.filter(
				(a) => a.armor_name.split(' ')[0] === armor[0].armor_name.split(' ')[0]
			).length === 4 ||
			isMonsterSet
		) {
			let base_name = armor[0].armor_name.split(' ');
			base_name.pop();

			output_name += base_name.join(' ');

			if (!output_name.endsWith('Armor') && !output_name.startsWith('Armor'))
				output_name += ' Armor';

			output.armor_set = output_name;
			output.armor_set_rarity = armor[0].rarity;

			if (isMonsterSet) {
				output.armor_set_rarity = 'rare';

				if (getId(armor[0]) === 'SPIDER_BOOTS')
					output.armor_set = 'Monter Hunter Armor';

				if (getId(armor[0]) === 'TARANTULA_BOOTS')
					output.armor_set = 'Monter Raider Armor';
			}

			if (isPerfectSet) {
				const sameTier = armor.filter(
					(a) =>
						getId(a)
							.split('_')
							.pop() ===
						getId(armor[0])
							.split('_')
							.pop()
				);

				if (sameTier)
					output.armor_set =
						'Perfect Armor - Tier ' +
						getId(armor[0])
							.split('_')
							.pop();
				else output.armor_set = 'Perfect Armor';
			}

			if (reforgeName) output.armor_set = reforgeName + ' ' + output.armor_set;
		}
	}

	return output;
};

export default getItems;
