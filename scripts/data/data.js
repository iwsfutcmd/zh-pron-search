import GwongDungRawData from './GwongDung_rimedata.json' with { type: 'json' };
import PinYinRawData from './PinYin_rimedata.json' with { type: 'json' };
import SouTseuRawData from './SouTseu_rimedata.json' with { type: 'json' };
import TungDzihRawData from './TungDzih_rimedata.json' with { type: 'json' };
import TsyetHjunHRawData from './TsyetHjunH_data.json' with { type: 'json' };

const pronTweaks = {
	PinYin: [
		{ regex: /v/, replace: 'ü' },
		{ regex: /eh/, replace: 'ê' }
	]
};

const tweakPron = (pron, system) => {
	const tweaks = pronTweaks[system];
	if (!tweaks) return pron;
	for (const tweak of tweaks) {
		pron = pron.replace(tweak.regex, tweak.replace);
	}
	return pron.normalize('NFC');
};

const buildData = (rawData, system) => {
	const result = {};

	for (const [char, entries] of rawData) {
		for (const entry of entries) {
			const pron = tweakPron(entry[system === 'TsyetHjunH' ? 2 : 0], system);
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
};
