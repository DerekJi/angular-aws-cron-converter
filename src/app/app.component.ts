import { Component, VERSION } from '@angular/core';
import { ICronOptions } from './core/cron-options.interface';
import { CronService } from './core/cron.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'AWS Cron Expression Converter';

  schedule: string = '0 12 3 8/3 ? *';
  get options(): ICronOptions {
    return this.cron.parse(this.schedule);
  }

  constructor(
    private cron: CronService,
  ) {

  }
}
