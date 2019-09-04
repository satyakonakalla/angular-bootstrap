import {Component, OnInit, ViewChild} from '@angular/core';

import {NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {formatDate } from '@angular/common';


@Component({
  selector: 'wdsk-dtr-library',
  templateUrl: './datepicker-popup.html',
  
  host: {
    "(document:click)": "onCalCompOutsideClick($event)"
  }
})
export class DtrLibraryComponent implements OnInit {
  model: NgbDateStruct;
  @ViewChild('content') content;
  dtrForm: FormGroup;
  ngbPopoverRef: any;
  formattedDate: any;
  selectedDate: string;
  constructor(private modalService: NgbModal) {
    
  }

  ngOnInit() {
    // this.today = Date.now();
    let today = new Date();
    let modifiedDate = formatDate(today, 'EEEE, MMMM d, yyyy -  HH:mm:ss', 'en-US');
    this.formattedDate = modifiedDate + ' EST';

    setTimeout(() => this.openDtrModal(this.content));
    this.dtrForm = new FormGroup({
      fpCode: new FormControl("", [Validators.required]),
      processDate: new FormControl("", [Validators.required])
      
    });

  }
  openDtrModal(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  calendarClicked(popover: any, calendarinputfield:any) {
    this.ngbPopoverRef = popover;

    if (popover.isOpen()) {
      popover.close();
      calendarinputfield.blur();
    } else {
      popover.open();
      calendarinputfield.focus();
    }    
  }

  inputFieldClicked(popover:any){
    console.log("inputFieldClicked");
    this.ngbPopoverRef = popover;
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open();
    }   
  }

  inputFieldFocused(popover:any){
    this.ngbPopoverRef = popover;
    if (!popover.isOpen()) {
      popover.open();
    }   
  }

  closeCalendarOnFocusOut(p){
    this.ngbPopoverRef = p;
    if (p.isOpen()) {
      p.close();
    }
  }
 
  populateSelectedDateInModel(selectedDateInCal:any){
    this.selectedDate = selectedDateInCal;
    this.ngbPopoverRef.close();
  }

  closeCalendar(input: any) {
    this.ngbPopoverRef.toggle();
  }

  handleKeyPress(event: any) {   
    event.preventDefault();
  }

  // onCalCompOutsideClick(event) { // close the datepicker when user clicks outside the element
  //   console.log(event.target.offsetParent.tagName)
  //   console.log(event.target.offsetParent !== null )
  //   console.log(event.target.offsetParent.tagName !== 'NGB-POPOVER-WINDOW')

    

  //   if (event.target.offsetParent !== null && (event.target.offsetParent.tagName !== 'NGB-POPOVER-WINDOW'
  //   || event.target.offsetParent.tagName !== 'FORM')) {
  //       this.ngbPopoverRef.close();
  //     }    
  // } 
}
