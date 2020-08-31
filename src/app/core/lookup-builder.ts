import { ILdpLookup } from "./lookup.interface";

export const LookupStartId = {
  projection: 1,
  format: 11,
  buffer: 21,
  period: 31,
  layer: 41,
  role: 51,
}

export function buildLookups(kind: string, names: string[], startId: number = 11) {
  let id = startId;
  let order = 1;
  return names.map(item => {
    const newItem: ILdpLookup = {
      id: id++,
      kind,
      code: item.toLocaleLowerCase().replace(/ /g, '-'),
      displayName: item,
      displayOrder: order++,
      enabled: true,
    };
    return newItem;
  });
}
