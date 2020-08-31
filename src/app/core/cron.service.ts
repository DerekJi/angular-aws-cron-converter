import { Injectable } from '@angular/core';
import { IAwsCron } from './aws-cron.interface';
import { ICronTime } from './cron-time.interface';
import { ICronOptions } from './cron-options.interface';
import { ILdpLookup } from './lookup.interface';
import { LookupPeriods, PERIODS } from './lookup-periods';

@Injectable({
  providedIn: 'root'
})
export class CronService {

  /**
   *
   * @param period
   * @param time
   * @param cronDate
   * @returns a string of cron expression
   */
  stringify(options: ICronOptions): string {
    const cron = this.toAwsCron(options.period, options.time, options.cronDate);
    return this.toSchedule(cron);
  }

  /**
   *
   * @param schedule a string of cron expression
   * @returns cron options
   */
  parse(schedule: string): ICronOptions {
    try {      
      const parts: string[] = schedule.split(' ');
      const cron: IAwsCron = {
        minute: parts[0],
        hour: parts[1],
        date: parts[2],
        month: parts[3],
        weekday: parts[4],
        year: parts[5],
      }
      let time: ICronTime = { min: +cron.minute, hour: +cron.hour };

      let period: ILdpLookup;
      let cronDate: Date;

      if (+cron.year > 0) {
        // Once Only
        period = PERIODS.onceOnly;
        cronDate = new Date(+cron.year, +cron.month - 1, +cron.date);
      } else {
        // Periodically
        const monthOptions: string[] = cron.month.split('/');
        const perMonths = monthOptions && monthOptions.length > 1 ? monthOptions[1] : 1;
        switch (+perMonths) {
          case 12: { period = PERIODS.yearly; break; }
          case 6: { period = PERIODS.halfYearly; break; }
          case 3: { period = PERIODS.quarterly; break; }
          case 1:
          default: {
            period = PERIODS.monthly;
            break;
          }
        }
        cronDate = new Date((new Date()).getFullYear(), +monthOptions[0] - 1, +cron.date);
      }
      const options: ICronOptions = { period, time, cronDate };
      return options;
    } catch (err) {
      // console.error(err);
      return null;
    }
  }


  /**
   *
   * @param period Period Lookup
   */
  public onceOnly(period: ILdpLookup): boolean { return period ? period.code.indexOf('once') >= 0 : false; }

  /**
   *
   * @param cron
   */
  private toSchedule(cron: IAwsCron): string {
    let schedule = `${cron.minute} ${cron.hour} ${cron.date} ${cron.month} ${cron.weekday} ${cron.year}`;

    return schedule;
  }

  /**
   *
   * @param period
   * @param time
   * @param cronDate
   */
  private toAwsCron(period: ILdpLookup, time: ICronTime, cronDate: Date): IAwsCron {
    const startMonth = (cronDate.getMonth() + 1).toString();
    const perMonth = this.perMonth(period).toString();

    const cron: IAwsCron = {
      minute: (time.min || 0).toString(),
      hour: (time.hour || 0).toString(),
      date: cronDate.getDate().toString(),
      month: this.onceOnly(period) ? startMonth : `${startMonth}/${perMonth}`,
      weekday: '?',
      year: this.onceOnly(period) ? cronDate.getFullYear().toString() : '*',
    };

    return cron;
  }

  /**
   *
   * @param period Period Lookup
   */
  private perMonth(period: ILdpLookup): number {
    if (!period) {
      return 1;
    }

    if (period.code === PERIODS.monthly.code) { return 1; }
    if (period.code === PERIODS.quarterly.code) { return 3; }
    if (period.code === PERIODS.halfYearly.code) { return 6; }
    if (period.code === PERIODS.yearly.code) { return 12; }
    return 0;
  }

  constructor() { }
}
