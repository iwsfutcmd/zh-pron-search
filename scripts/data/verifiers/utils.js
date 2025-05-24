export const sorted = (l) => '(' + l.toSorted((s0, s1) => s1.length - s0.length).join('|') + ')';
