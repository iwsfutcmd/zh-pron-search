import JyutPingRimeData from './JyutPing.rimedata.json' with { type: 'json' };
import PinYinRimeData from './PinYin.rimedata.json' with { type: 'json' };
import SouTseuWuGniuRimeData from './SouTseuWuGniu.rimedata.json' with { type: 'json' };
import TungDzihRimeData from './TungDzih.rimedata.json' with { type: 'json' };
import BaxterData from './Baxter.data.json' with { type: 'json' };
import JyutPingWiktionaryData from './JyutPing.wiktionary.json' with { type: 'json' };
import PinYinWiktionaryData from './PinYin.wiktionary.json' with { type: 'json' };
import WuGniuWiktionaryData from './WuGniu.wiktionary.json' with { type: 'json' };
import PehOeJiWiktionaryData from './PehOeJi.wiktionary.json' with { type: 'json' };
import BaxterWiktionaryData from './Baxter.wiktionary.json' with { type: 'json' };
import BaxterSagartWiktionaryData from './BaxterSagart.wiktionary.json' with { type: 'json' };
import verifiers from './verifiers.js';

const pronTweaks = {
	RimeData: {
		PinYin: [
			{ regex: /v/g, replace: 'ü' },
			{ regex: /eh/g, replace: 'ê' }
		]
	},
	Wiktionary: {
		JyutPing: [
			{ regex: /¹/g, replace: '1' },
			{ regex: /²/g, replace: '2' },
			{ regex: /³/g, replace: '3' },
			{ regex: /⁴/g, replace: '4' },
			{ regex: /⁵/g, replace: '5' },
			{ regex: /⁶/g, replace: '6' },
			{ regex: /⁻/g, replace: '-' }
		],
		PinYin: [
			{ regex: /⁰/g, replace: '0' },
			{ regex: /¹/g, replace: '1' },
			{ regex: /²/g, replace: '2' },
			{ regex: /³/g, replace: '3' },
			{ regex: /⁴/g, replace: '4' },
			{ regex: /⁵/g, replace: '5' }
		],
		WuGniu: [
			{ regex: /⁰(.+)/g, replace: '$10' },
			{ regex: /¹(.+)/g, replace: '$11' },
			{ regex: /²(.+)/g, replace: '$12' },
			{ regex: /³(.+)/g, replace: '$13' },
			{ regex: /⁴(.+)/g, replace: '$14' },
			{ regex: /⁵(.+)/g, replace: '$15' },
			{ regex: /⁶(.+)/g, replace: '$16' },
			{ regex: /⁷(.+)/g, replace: '$17' },
			{ regex: /⁸(.+)/g, replace: '$18' },
			{ regex: /ieoq/g, replace: 'ieq' }
		],
		BaxterSagart: [
			{ regex: /\//g, replace: '' },
			{ regex: /\*/g, replace: '' },
			{ regex: /g/g, replace: 'ɡ' }
		]
	}
};

const tweakPron = (pron, source, system) => {
	let newPron = !['Baxter', 'BaxterSagart'].includes(system)
		? (pron.toLowerCase?.() ?? pron)
		: pron;
	const tweaks = pronTweaks[source][system];
	if (!tweaks) return newPron;
	for (const tweak of tweaks) {
		newPron = newPron.replaceAll(tweak.regex, tweak.replace);
	}
	return newPron.normalize('NFC');
};

const buildWiktionaryData = (wiktionaryData, system, result = {}) => {
	for (const [char, prons] of Object.entries(wiktionaryData)) {
		if (!char.match(/^\p{sc=Han}$/u)) continue;
		for (const pron of prons) {
			for (const vpron of pron.split(/(?:／|; )/gu)) {
				const tweakedPron = tweakPron(vpron, 'Wiktionary', system);
				if (system !== 'BaxterSagart' && !verifiers[system]?.test(tweakedPron)) continue;
				result[tweakedPron] =
					result[tweakedPron]?.add(char.normalize('NFC')) ?? new Set(char.normalize('NFC'));
			}
		}
	}
	return result;
};

const buildData = (rawData, system, result = {}) => {
	for (const [char, entries] of rawData) {
		for (const entry of entries) {
			const tweakedPron = tweakPron(entry[system === 'Baxter' ? 2 : 0], 'RimeData', system);
			if (!verifiers[system]?.test(tweakedPron)) continue;
			result[tweakedPron] =
				result[tweakedPron]?.add(char.normalize('NFC')) ?? new Set(char.normalize('NFC'));
		}
	}
	return result;
};

export default {
	JyutPing: buildWiktionaryData(
		JyutPingWiktionaryData,
		'JyutPing',
		buildData(JyutPingRimeData, 'JyutPing')
	),
	PinYin: buildWiktionaryData(PinYinWiktionaryData, 'PinYin', buildData(PinYinRimeData, 'PinYin')),
	WuGniu: buildWiktionaryData(
		WuGniuWiktionaryData,
		'WuGniu',
		buildData(SouTseuWuGniuRimeData, 'WuGniu')
	),
	TungDzih: buildData(TungDzihRimeData, 'TungDzih'),
	Baxter: buildWiktionaryData(BaxterWiktionaryData, 'Baxter', buildData(BaxterData, 'Baxter')),
	BaxterSagart: buildWiktionaryData(BaxterSagartWiktionaryData, 'BaxterSagart')
};
