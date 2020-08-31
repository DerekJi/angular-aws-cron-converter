import { ILdpLookup } from "./lookup.interface";
import { buildLookups, LookupStartId } from "./lookup-builder";

const kind = 'Period';
const periods: string[] = [
  'Once Only',
  'Monthly',
  'Quarterly',
  'Half-yearly',
  'Yearly',
];


export const LookupPeriods: ILdpLookup[] = buildLookups(kind, periods, LookupStartId.period);

export const PERIODS = {
  onceOnly: LookupPeriods.find(x => x.code === periods[0].toLowerCase().replace(/ /g, '-')),
  monthly: LookupPeriods.find(x => x.code === periods[1].toLowerCase().replace(/ /g, '-')),
  quarterly: LookupPeriods.find(x => x.code === periods[2].toLowerCase().replace(/ /g, '-')),
  halfYearly: LookupPeriods.find(x => x.code === periods[3].toLowerCase().replace(/ /g, '-')),
  yearly: LookupPeriods.find(x => x.code === periods[4].toLowerCase().replace(/ /g, '-')),
}
