import { Component } from '@angular/core';
import { ICronOptions } from './core/cron-options.interface';
import { CronService } from './core/cron.service';
import { FormBuilder } from '@angular/forms';
import { ILdpLookup } from './core/lookup.interface';
import { PERIODS } from './core/lookup-periods';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'AWS Cron Expression Converter';
  readonly defaultSchedule = '0 12 3 8/3 ? *';

  editForm = this.fb.group({
    period: '',
    onceDate: null,
    nextDate: null,
    // schedule: this.defaultSchedule,
  });

  get period(): number {
    return this.editForm.get('period').value as number;
  }

  get selectedPeriodLookup(): ILdpLookup {
    switch (+this.period) {
      case 1: return PERIODS.monthly;
      case 3: return PERIODS.quarterly;
      case 6: return PERIODS.halfYearly;
      case 12: return PERIODS.yearly;
      case 99: return PERIODS.onceOnly;
      default:
        return null;
    }
  }

  get schedule(): string {
    const options: ICronOptions = {
      period: this.selectedPeriodLookup,
      time: { hour: 9, min: 0 },
      cronDate: new Date(this.period < 99 ? this.editForm.value.nextDate : this.editForm.value.onceDate)
    };
    const result = (options.period && options.cronDate) ? this.cron.stringify(options) : this.defaultSchedule;
    console.log(result);
    return result;
  }

  get options(): ICronOptions {
    return this.cron.parse(this.schedule);
  }

  constructor(
    private cron: CronService,
    private fb: FormBuilder,
  ) {

  }
}
