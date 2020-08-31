import { ICronTime } from './cron-time.interface';
import { ILdpLookup } from './lookup.interface';

export interface ICronOptions {
  period?: ILdpLookup;
  time?: ICronTime;
  cronDate?: Date;
}
