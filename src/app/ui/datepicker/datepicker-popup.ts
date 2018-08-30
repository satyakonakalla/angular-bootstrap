import {Component, ViewChild, OnInit} from '@angular/core';
import {NgbModal, NgbDateStruct, NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { DtrCalendarComponent } from './dtr-calendar.component';

@Component({
  selector: 'dtr-modal',
  templateUrl: './datepicker-popup.html'  
})
export class DtrModalComponent implements OnInit{
  
  @ViewChild('content') content;
  
  dtrForm: FormGroup;
  ngbPopoverRef: any;
  today: number; 
  selectedDate: string;  

  constructor(private modalService: NgbModal) { }

  ngOnInit(){
    this.today = Date.now();
    setTimeout(() =>  this.openDtrModal(this.content));
    this.dtrForm = new FormGroup({
      fpCode: new FormControl("",[Validators.required]),
      processDate: new FormControl("",[Validators.required])
    });    
  }

  openDtrModal(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  populateSelectedDateInModel(selectedDateInCal:any){
    this.selectedDate = selectedDateInCal;
    this.ngbPopoverRef.close();
  }
  
  calendarClicked(p:any){
    this.ngbPopoverRef = p;
    this.ngbPopoverRef.toggle();
  }  
}