import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';


import { NgbModalModule, NgbDatepickerModule  } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from './ui/ui.module';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule, NgbDatepickerModule.forRoot(), FormsModule, UiModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
