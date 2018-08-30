import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dtr-calendar',
    templateUrl: './dtr-calendar.component.html',
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
export class DtrCalendarComponent implements OnInit {

    minDateVal: NgbDate;
    maxDateVal: NgbDate;
    hoveredDate: NgbDate;
    fromDate: NgbDate;
    toDate: NgbDate;
    calCurrSelectedDate: NgbDate;
    formattedDate: string;
    dateReviewAuditType: string = 'review';
    fromDateErrorMsg: string = "";

    @Input("selectedDate")
    selectedDate: string;

    @Output() selectedDateChange = new EventEmitter();

    constructor(calendar: NgbCalendar) { }

    ngOnInit() {
        this.radioValChanged();
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {  
            if(propName == "selectedDate"){
                let change = changes[propName];
                let curVal  = change.currentValue;
                let prevVal = change.previousValue;
                
                if(curVal != prevVal){

                    if(curVal.indexOf("-") > 0){
                        this.dateReviewAuditType = "audit";
                        let inputfromDate = curVal.substring(0, 8);
                        let inputToDate = curVal.substring(9);

                        if(inputfromDate){
                            let auditFromNgbDate = this.getNgbDateFromStringDate(inputfromDate);
                            this.checkFutureDate(auditFromNgbDate);
                            this.checkFromDateValidity(auditFromNgbDate);
                            this.fromDate = auditFromNgbDate;
                        }
                        if(inputToDate){
                            let auditToNgbDate = this.getNgbDateFromStringDate(inputToDate);
                            this.checkFutureDate(auditToNgbDate);
                            this.toDate = auditToNgbDate;
                        }           
                    }else{
                        this.dateReviewAuditType = "review";
                        let reivewNgbDate = this.getNgbDateFromStringDate(curVal);
                        this.calCurrSelectedDate = reivewNgbDate;
                    }                    
                }                   
            }           
        }
     }

     getNgbDateFromStringDate(strDate:string){
        let year = Number(strDate.substring(0, 4));
        let month = Number(strDate.substring(4, 6));
        let date = Number(strDate.substring(6, 8));  
        let ngbDate: NgbDate = new NgbDate(year, month, date);
        return ngbDate;
     }

    selectDate(date: NgbDate) {

        this.fromDateErrorMsg = "";
        if (this.dateReviewAuditType == 'review') {
            this.toDate = null;
            this.fromDate = null;
            this.hoveredDate = null;
            let monthVal = this.prependZeroForMonth(date.month);
            this.formattedDate = date.year.toString() + monthVal + date.day.toString();
        } else if (this.dateReviewAuditType == 'audit') {

            this.formattedDate = "";
            this.fromDate = date;
            let tempToDate: Date = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
            tempToDate.setDate(tempToDate.getDate() + 6);
            let tempNgbToDate: NgbDate = new NgbDate(tempToDate.getFullYear(), tempToDate.getMonth() + 1, tempToDate.getDate());
            this.toDate = tempNgbToDate;

            // if (!this.fromDate && !this.toDate) {
            //   this.fromDate = date;
            // } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            //   this.toDate = date;
            // } else {
            //   this.toDate = null;
            //   this.fromDate = date;
            // }

            this.checkFutureDate(this.fromDate);

            if (this.fromDate) {
                this.checkFromDateValidity(this.fromDate);
            }

            if (this.fromDate && this.toDate) {
                let isValid = this.daysDiffernceValid(this.fromDate, this.toDate);

                if (isValid) {
                    let fromMonthVal = this.prependZeroForMonth(this.fromDate.month);
                    let toMonthVal = this.prependZeroForMonth(this.toDate.month);
                    this.formattedDate = this.fromDate.year.toString() + fromMonthVal + this.fromDate.day.toString()
                        + '-' + this.toDate.year.toString() + toMonthVal + this.toDate.day.toString();
                }
            }
        }
    }

    radioValChanged() {
        this.formattedDate = "";
        this.fromDateErrorMsg = "";

        if (this.dateReviewAuditType == 'review') {
            let date: Date = new Date();

            let maxDate: NgbDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
            this.maxDateVal = maxDate;

            let reviewdate: Date = this.getPreviousSpecifiedWorkingsDaysBackDate();
            let minDate: NgbDate = new NgbDate(reviewdate.getFullYear(), reviewdate.getMonth() + 1, reviewdate.getDate());
            this.minDateVal = minDate;
        } else {
            let date: Date = new Date();
            let maxDate: NgbDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
            this.maxDateVal = maxDate;

            let auditdate: Date = new Date();
            auditdate.setFullYear(auditdate.getFullYear() - 1);
            let minDate: NgbDate = new NgbDate(auditdate.getFullYear(), auditdate.getMonth() + 1, auditdate.getDate());
            this.minDateVal = minDate;
        }
    }

    getPreviousSpecifiedWorkingsDaysBackDate(): Date {

        let todayDate: Date = new Date();
        let workingDaysCounter: number = 1;

        while (true) {
            let weekDay = todayDate.getDay();
            if (weekDay != 0 && weekDay != 6) { //0 - sunday, 6 - saturday
                workingDaysCounter = workingDaysCounter + 1;
            }
            todayDate.setDate(todayDate.getDate() - 1);
            if (workingDaysCounter >= 20) {
                break;
            }
        }
        return todayDate;
    }

    getMinDateVal() {
        return this.minDateVal;
    }

    getMaxDateVal() {
        return this.maxDateVal;
    }

    getTemplateVal() {
        if (this.dateReviewAuditType == 'review') {
            return "";
        } else if (this.dateReviewAuditType == 'audit') {
            return "t";
        }

    }

    prependZeroForMonth(monthval: number): string {
        let monthStr = monthval.toString();
        if (monthStr.length < 2) {
            monthStr = '0' + monthStr;
        }
        return monthStr;
    }

    daysDiffernceValid(fromDate: NgbDate, toDate: NgbDate) {
        let fromDateJS: Date = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
        let toDateJS: Date = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);

        var timeDiff = Math.abs(toDateJS.getTime() - fromDateJS.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays != 6) {
            this.fromDateErrorMsg = "Starting day must be sunday and Ending Date must be Saturday";
            this.toDate = null;
            this.fromDate = null;
            this.hoveredDate = null;
            return false;
        } else {
            return true;
        }
    }

    checkFromDateValidity(fromDate: NgbDate) {
        let date: Date = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
        let weekDay = date.getDay();

        if (weekDay != 0) { //0 - sunday, 6 - saturday
            this.fromDateErrorMsg = "Starting day must be sunday";
            this.toDate = null;
            this.fromDate = null;
            this.hoveredDate = null;
        }
    }

    checkFutureDate(ngbDate:NgbDate) {
        let date: Date = new Date();
        let currDate: NgbDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

        if (ngbDate.after(currDate)) {
            this.toDate = null;
            this.fromDate = null;
            this.hoveredDate = null;
        }         
    }

    populateDate() {
        this.selectedDateChange.emit(this.formattedDate);
    }

    isHovered = (date: NgbDate) => {
        //console.log('isHovered-->'+date.day)
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }
    isInside = (date: NgbDate) => {
        //console.log('isInside-->'+date.day);
        return date.after(this.fromDate) && date.before(this.toDate);
    }
    isRange = (date: NgbDate) => {
        //console.log('isRange-->'+date.day)
        return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
    }

}