import GwongDungRawData from '$lib/GwongDung_rimedata.json5';
import PinYinRawData from '$lib/PinYin_rimedata.json5';
import SouTseuRawData from '$lib/SouTseu_rimedata.json5';
import TungDzihRawData from '$lib/TungDzih_rimedata.json5';
import TsyetHjunHRawData from '$lib/TsyetHjunH_data.json5';

const pronTweaks: Record<string, { regex: RegExp; replace: string }[]> = {
	PinYin: [
		{ regex: /v/, replace: 'ü' },
		{ regex: /eh/, replace: 'ê' }
	]
};

const tweakPron = (pron: string, system: string) => {
	const tweaks = pronTweaks[system];
	if (!tweaks) return pron;
	for (const tweak of tweaks) {
		pron = pron.replace(tweak.regex, tweak.replace);
	}
	return pron.normalize('NFC');
};

const buildData = (
	rawData:
		| [string, [string, string, string][]][]
		| [string, [number, number, string, string, string][]][],
	system: string
) => {
	const result: Record<string, Set<string>> = {};

	for (const [char, entries] of rawData) {
		for (const entry of entries) {
			const pron = tweakPron(entry[system === 'TsyetHjunH' ? 2 : 0] as string, system);
			result[pron] = result[pron]?.add(char.normalize('NFC')) ?? new Set(char.normalize('NFC'));
		}
	}
	return result;
};

export default {
	GwongDung: buildData(GwongDungRawData, 'GwongDung'),
	PinYin: buildData(PinYinRawData, 'PinYin'),
	SouTseu: buildData(SouTseuRawData, 'SouTseu'),
	TungDzih: buildData(TungDzihRawData, 'TungDzih'),
	TsyetHjunH: buildData(TsyetHjunHRawData, 'TsyetHjunH')
} as Record<string, Record<string, Set<string>>>;
