import * as util from 'util';
import * as nbt from 'prismarine-nbt';

const parseNbt = util.promisify(nbt.parse);

const decodeInventoryData = async (base64) => {
	let buf = Buffer.from(base64, 'base64');

	let data = await parseNbt(buf);
	data = nbt.simplify(data);

	return data.i;
};

export default decodeInventoryData;
