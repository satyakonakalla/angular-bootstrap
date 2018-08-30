import {Component, ViewChild, OnInit} from '@angular/core';
import {NgbModal, NgbDateStruct, NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'dtr-modal',
  templateUrl: './datepicker-popup.html',
  styles: [`
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
    .custom-day.disabled {
      color: #6c757d !important;
      border-color:#f8f9fa;
      opacity: 0.5;
    }
  `]
  
})
export class DtrModalComponent implements OnInit{
  
  model: NgbDateStruct;
  @ViewChild('content') content;
  dtrForm: FormGroup;

  ngbPopoverRef: any;
  today: number;

  minDateVal:NgbDate ;
  maxDateVal:NgbDate;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;

  selectedDate: string;
  formattedDate: string;
  dateReviewAuditType: string = 'review';
  fromDateErrorMsg: string ="";

  constructor(private modalService: NgbModal) {}

  ngOnInit(){
    this.today = Date.now();
    setTimeout(() =>  this.openDtrModal(this.content));
    this.dtrForm = new FormGroup({
      fpCode: new FormControl("",[Validators.required]),
      processDate: new FormControl("",[Validators.required])
    });
    this.radioValChanged();
  }

  openDtrModal(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  selectDate(date: NgbDate){
    this.fromDateErrorMsg = "";
    
    if(this.dateReviewAuditType == 'review'){
      this.toDate = null;
      this.fromDate = null;
      this.hoveredDate = null;

      let monthVal = this.prependZeroForMonthORDate(date.month);    
      let dayVal = this.prependZeroForMonthORDate(date.day);  
      
      this.formattedDate = date.year.toString() + monthVal + dayVal;
    
    } else if(this.dateReviewAuditType == 'audit'){
    
      this.formattedDate = "";
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        this.toDate = date;
      } else {
        this.toDate = null;
        this.fromDate = date;
      }
      if(this.fromDate){
        this.checkFromDateValidity(this.fromDate);        
      }

      if(this.fromDate && this.toDate){
        let isValid = this.daysDiffernceValid(this.fromDate, this.toDate);
        if(isValid){
          let fromMonthVal = this.prependZeroForMonthORDate(this.fromDate.month);
          let toMonthVal = this.prependZeroForMonthORDate(this.toDate.month);

          let fromDayVal = this.prependZeroForMonthORDate(this.fromDate.day);
          let toDayVal = this.prependZeroForMonthORDate(this.toDate.day);

          this.formattedDate = this.fromDate.year.toString() + fromMonthVal + fromDayVal 
            +'-'+this.toDate.year.toString() + toMonthVal + toDayVal;
        }        
      }      
    }    
  }

  populateDate(){
    this.selectedDate = this.formattedDate;
    this.ngbPopoverRef.close();
  }

  checkDateValidity(control: AbstractControl) {}
 

  calendarClicked(p:any){
    console.log("calendarClicked")
    this.ngbPopoverRef = p;
    this.ngbPopoverRef.toggle();
  }

  documentClicked(p:any){
    console.log("documentClicked")
  }

  radioValChanged(){
    this.formattedDate = "";
    this.fromDateErrorMsg = "";

    if(this.dateReviewAuditType == 'review'){
      let date:Date = new Date();
      let maxDate: NgbDate = new NgbDate(date.getFullYear(),date.getMonth()+1,date.getDate());
      this.maxDateVal = maxDate;

      let reviewdate:Date = this.getPreviousSpecifiedWorkingsDaysBackDate();
      let minDate: NgbDate = new NgbDate(reviewdate.getFullYear(),reviewdate.getMonth()+1,reviewdate.getDate());
      this.minDateVal = minDate;      

    }else if(this.dateReviewAuditType == 'audit'){
      
      let date:Date = new Date();
      let maxDate: NgbDate = new NgbDate(date.getFullYear(),date.getMonth()+1,date.getDate());
      this.maxDateVal = maxDate;

      let auditdate:Date = new Date();
      auditdate.setFullYear(auditdate.getFullYear()-1);
      let minDate: NgbDate = new NgbDate(auditdate.getFullYear(),auditdate.getMonth()+1,auditdate.getDate());
      this.minDateVal = minDate;  
    }    
  }

  getMinDateVal(){
    return this.minDateVal;
  }

  getMaxDateVal(){
    return this.maxDateVal;
  }

  prependZeroForMonthORDate(dateOrMonthVal:number):string{
    let dateOrMonthStr = dateOrMonthVal.toString();
    if(dateOrMonthStr.length < 2){
      dateOrMonthStr = '0'+dateOrMonthStr;
    }
    return dateOrMonthStr;
  }

  getPreviousSpecifiedWorkingsDaysBackDate():Date{

    let todayDate:Date = new Date();
    let workingDaysCounter:number = 1;

    while(true){
      let weekDay = todayDate.getDay();
      if(weekDay != 0 && weekDay != 6){ //0 - sunday, 6 - saturday
        workingDaysCounter = workingDaysCounter+1;
      }
      todayDate.setDate(todayDate.getDate()-1);
      if(workingDaysCounter >= 20){
        break;
      }     
    }
    return todayDate;
  }

  daysDiffernceValid(fromDate:NgbDate, toDate: NgbDate){
    let fromDateJS: Date = new Date(this.fromDate.year,this.fromDate.month-1,this.fromDate.day);
    let toDateJS: Date = new Date(this.toDate.year,this.toDate.month-1,this.toDate.day);

    var timeDiff = Math.abs(toDateJS.getTime() - fromDateJS.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    if(diffDays != 6){
        this.fromDateErrorMsg = "Starting day must be Sunday and Ending Date must be Saturday";
        this.toDate = null;
        this.fromDate = null;
        this.hoveredDate = null;
        return false;
    }else{
      return true;
    }
  }

  checkFromDateValidity(fromDate:NgbDate){
      let date:Date = new Date(this.fromDate.year,this.fromDate.month-1,this.fromDate.day);
      let weekDay = date.getDay();

      if(weekDay != 0){ //0 - sunday, 6 - saturday
          this.fromDateErrorMsg = "Starting day must be Sunday";
          this.toDate = null;
          this.fromDate = null;
          this.hoveredDate = null;
      }
  }

  isHovered = (date: NgbDate) => {
    //console.log("isHovered-->"+date.day);
    this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }
  isInside = (date: NgbDate) => {
    //console.log("isInside-->"+date.day);
    date.after(this.fromDate) && date.before(this.toDate);
  }
  isRange = (date: NgbDate) => {
    //console.log("isRange-->"+date.day);
    date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
  isMouseEnter = (date: NgbDate) => {
    //console.log("isMouseEnter-->"+date.day);
    this.hoveredDate = date;
  }
  isMouseLeave = (date: NgbDate) => {
    //console.log("isMouseLeave-->"+date.day);
    this.hoveredDate = null;
  }

}