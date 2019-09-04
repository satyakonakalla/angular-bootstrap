import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DtrLibraryComponent } from './datepicker/datepicker-popup';
import { CalendarComponent } from './datepicker/dtr-calendar.component';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {HolidayService} from './holidays/services/holiday.service';
import { BillpaymentsComponent } from './billpayments/billpayments.component';
import { BillslistComponent } from './billslist/billslist.component';
import { LayoutComponent} from './layout/layout.component'

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule.forRoot(), NgbModule.forRoot(),
    NgbDatepickerModule.forRoot()
  ],
  declarations: [ DtrLibraryComponent, LayoutComponent, 
    CalendarComponent, BillpaymentsComponent, BillslistComponent],
  providers: [HolidayService],
  exports: [LayoutComponent]
})
export class UiModule { }
