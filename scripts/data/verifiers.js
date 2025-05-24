import { sorted } from './verifiers/utils.js';
import { verifier as BaxterSagart } from './verifiers/BaxterSagart.js';
// prettier-ignore
const JyutPingInitials = ['b','p','m','f','d','t','n','l','g','k','ng','h','g','k','z','c','s'];
const JyutPingMedials = ['w', 'j'];
const JyutPingVowels = ['aa', 'a', 'e', 'i', 'o', 'u', 'eo', 'oe', 'yu'];
const JyutPingCodas = ['i', 'u', 'm', 'n', 'ng', 'p', 't', 'k'];
const JyutPingTones = ['1', '2', '3', '4', '5', '6'];

// prettier-ignore
const PinYinInitials = ['b','p','m','f','d','t','n','l','g','k','h','j','q','x','zh','ch','sh','r','z','c','s','y','w','yu'];
const PinYinMedials = ['y', 'i', 'w', 'u', 'yu', 'ü', 'v'];
const PinYinVowels = ['e', 'o', 'a', 'eh', 'ê', 'hm'];
const PinYinCodas = ['i', 'u', 'o', 'n', 'ng', 'r'];
const PinYinTones = ['1', '2', '3', '4', '5', '0'];

// prettier-ignore
const BaxterInitials = ['p','ph','b','m','t','th','d','n','l','tr','trh','dr','nr','ts','tsh','dz','s','z','tsr','tsrh','dzr','sr','zr','tsy','tsyh','dzy','ny','sy','zy','y','k','kh','g','ng',"'",'x','h'];
const BaxterMedials = ['j', 'w', 'jw'];
const BaxterVowels = ['u', 'o', 'a', 'a', 'ae', 'ea', 'e', 'i', '\\+', 'ie'];
const BaxterCodas = ['j', 'w', 'm', 'n', 'ng', 'wng', 'p', 't', 'k', 'wk'];
const BaxterTones = ['X', 'H'];

// prettier-ignore
const WuGniuInitials = ['p','ph','b','m','f','v','vh','t','th','d','n','l','ts','tsh','dz','s','z','c','ch','j','gn','sh','zh','k','kh','g','ng','h','gh','y','w'];
const WuGniuMedials = ['i', 'u', 'iu', 'ui'];
// prettier-ignore
const WuGniuVowels = ['y', 'yu', 'a', 'o', 'ou', 'e', 'au', 'eu', 'oe', 'ao', 'ae', 'ai', 'ei', 'ee', 'eo'];
const WuGniuCodas = ['n', 'q', 'r'];
const WuGniuTones = ['1', '2', '3', '4', '5', '6', '7', '8', '0'];

// prettier-ignore
const TungDzihInitials = ['b','p','bh','m','f','fv','v','d','t','dh','n','dy','ty','dhy','z','ts','dz','s','sz','dr','tr','jr','sr','zr','j','ch','zh','sh','dj','c','k','g','q','x','h','l','r','y','w','lh','mh','nh','rh'];
const TungDzihMedials = ['i', 'ii', 'u', 'uu', 'iu', 'iuu', 'iui', '(?<=^y)ui', 'e(?=a|oc)', 'y'];
const TungDzihVowels = ['o', 'oo', 'a', 'aa', 'e', 'ee', 'ae(?=ng|g|q|c)', 'ou', 'er', 'ar'];
// prettier-ignore
const TungDzihCodas = ['m','mm','p','n','nn','t','i','e','y','u','o','w','ng','g','q','c','r','rr'];

const BaxterSagartPrefixes = sorted(['C.']);
// prettier-ignore
const BaxterSagartInitials = sorted([
    "p","pʰ","b","m","m̥","t","tʰ","d","n","n̥","ts","tsʰ","dz","s","l","l̥","r","r̥","k","kʰ","ɡ","ŋ","ŋ̊","kʷ","kʷʰ","ɡʷ","ŋʷ","ŋ̊ʷ","q","qʰ","ɢ","qʷ","qʷʰ","ɢʷ","ʔ","ʔʷ"
]);
const BaxterSagartMedials = sorted(['r']);
const BaxterSagartVowels = sorted(['i', 'u', 'ə', 'e', 'o', 'a']);
const BaxterSagartCodas = sorted(['j', 'w', 'n', 'm', 'ŋ', 'r', 't', 'p', 'k', 'wk']);
const BaxterSagartSuffixes = sorted(['ʔ', 's']);
export default {
	JyutPing: new RegExp(
		`^${sorted(JyutPingInitials)}?${sorted(JyutPingMedials)}?${sorted(JyutPingVowels)}?${sorted(JyutPingCodas)}?${sorted(JyutPingTones)}(-${sorted(JyutPingTones)})?$`
	),
	PinYin: new RegExp(
		`^${sorted(PinYinInitials)}?${sorted(PinYinMedials)}?${sorted(PinYinVowels)}?${sorted(PinYinCodas)}?${sorted(PinYinTones)}?$`
	),
	Baxter: new RegExp(
		`^${sorted(BaxterInitials)}${sorted(BaxterMedials)}?${sorted(BaxterVowels)}?${sorted(BaxterCodas)}?${sorted(BaxterTones)}?$`
	),
	WuGniu: new RegExp(
		`^${sorted(WuGniuInitials)}?${sorted(WuGniuMedials)}?${sorted(WuGniuVowels)}?${sorted(WuGniuCodas)}?${sorted(WuGniuTones)}?$`
	),
	TungDzih: new RegExp(
		`^${sorted(TungDzihInitials)}?${sorted(TungDzihMedials)}?${sorted(TungDzihVowels)}?${sorted(TungDzihCodas)}?(h)?$`
	),
	BaxterSagart
};
