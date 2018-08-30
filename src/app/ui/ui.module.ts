import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DtrModalComponent } from './datepicker/datepicker-popup';
import { DtrCalendarComponent } from './datepicker/dtr-calendar.component';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule.forRoot(), NgbModule.forRoot()
  ],
  declarations: [LayoutComponent, HeaderComponent, FooterComponent, DtrModalComponent, DtrCalendarComponent],
  exports: [LayoutComponent]
})
export class UiModule { }
