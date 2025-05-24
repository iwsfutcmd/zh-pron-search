import { sorted } from './utils.js';

const pre = sorted(['C', 'k', 'p', 'm', 's', 't', 'N']);
// prettier-ignore
const init = sorted([
    "p","pʰ","b","m","m̥","t","tʰ","d","n","n̥","ts","tsʰ","dz","s","l","l̥","r","r̥","k","kʰ","ɡ","ŋ","ŋ̊","kʷ","kʷʰ","ɡʷ","ŋʷ","ŋ̊ʷ","q","qʰ","ɢ","qʷ","qʷʰ","ɢʷ","ʔ","ʔʷ"
]);
const medi = sorted(['r']);
const vow = sorted(['i', 'u', 'ə', 'e', 'o', 'a']);
const coda = sorted(['j', 'w', 'n', 'm', 'ŋ', 'r', 't', 'p', 'k', 'wk']);
const suff = sorted(['ʔ', 's']);

export const verifier = new RegExp(
	`^(\\(?\\[?${pre}\\]?ə?[-.]\\)?)?\\[?${init}\\]?ˤ?\\]?(\\(?${medi}\\)?)?\\[?${vow}\\]?(\\(?\\[?${coda}\\]?\\)?)?(-?${suff})?(-?${suff})?$`
);
// new RegExp(
//     `^(\\(?${sorted(BaxterSagartPrefixes)}\\)?)?${sorted(BaxterSagartInitials)}ˤ?${sorted(BaxterSagartMedials)}?${sorted(BaxterSagartVowels)}${sorted(BaxterSagartCodas)}?(-?${sorted(BaxterSagartSuffixes)})?$`
// )
