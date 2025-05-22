import GwongDungRawData from '$lib/GwongDung_rimedata.json5';
import PinYinRawData from '$lib/PinYin_rimedata.json5';
import SouTseuRawData from '$lib/SouTseu_rimedata.json5';
import TungDzihRawData from '$lib/TungDzih_rimedata.json5';
import TsyetHjunHRawData from '$lib/TsyetHjunH_data.json5';

export const buildData = (rawData: [string, [string, string, string][]][]) => {
	const result: Record<string, string[]> = {};

	for (const [char, entries] of rawData) {
		for (const entry of entries) {
			result[entry[0]] = [...(result[entry[0]] ?? []), char];
		}
	}
	return result;
};

const buildTsyetHjunHData = (rawData: [string, [number, number, string, string, string][]][]) => {
	const result: Record<string, string[]> = {};

	for (const [char, entries] of rawData) {
		for (const entry of entries) {
			result[entry[2]] = [...(result[entry[2]] ?? []), char];
		}
	}
	return result;
};

export default {
	GwongDung: buildData(GwongDungRawData),
	PinYin: buildData(PinYinRawData),
	SouTseu: buildData(SouTseuRawData),
	TungDzih: buildData(TungDzihRawData),
	TsyetHjunH: buildTsyetHjunHData(TsyetHjunHRawData)
} as Record<string, Record<string, string[]>>;
