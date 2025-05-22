// import type { Part, SystemName, Han } from '$lib/Types';

// declare module '$lib/mcToBaxter.json5' {
// 	const value: { initial: [string, string][]; final: [string, string][] };
// 	export default value;
// }

declare module '$lib/TsyetHjunH_data.json5' {
	const value: [string, [number, number, string, string, string][]][];
	export default value;
}

declare module '*_rimedata.json5' {
	const value: [string, [string, string, string][]][];
	export default value;
}

// declare module '*_classes.json5' {
// 	const value: Partial<Record<Part, Record<string, string>>>;
// 	export default value;
// }

// declare module '*_simpleMap.json5' {
// 	const value: Record<SystemName, Record<Part, [string, string][]>>;
// 	export default value;
// }

// declare module '*_advancedMap.json5' {
// 	const value: Record<SystemName, Record<Part, [string, string][]>>;
// 	export default value;
// }

declare module '*.json5' {
	const value: any;
	export default value;
}
