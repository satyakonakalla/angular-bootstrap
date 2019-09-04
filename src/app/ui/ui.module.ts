import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DtrLibraryComponent } from './datepicker/datepicker-popup';
import { CalendarComponent } from './datepicker/dtr-calendar.component';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbMomentjsAdapter } from './moment/ngb-momentjs-adapter';
import {HolidayService} from './holidays/services/holiday.service';
import { BillpaymentsComponent } from './billpayments/billpayments.component';
import { BillslistComponent } from './billslist/billslist.component';




@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule.forRoot(), NgbModule.forRoot(),
    NgbDatepickerModule.forRoot()
  ],
  declarations: [LayoutComponent, HeaderComponent, FooterComponent, DtrLibraryComponent, 
    CalendarComponent, BillpaymentsComponent, BillslistComponent],
  providers: [NgbMomentjsAdapter, HolidayService],
  exports: [LayoutComponent]
})
export class UiModule { }
