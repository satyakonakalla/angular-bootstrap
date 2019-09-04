import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

const REVIEW_DAYS_ELIGIBLE: number = 25;

@Component({
  selector: 'wdsk-app-calendar',
  templateUrl: './dtr-calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dtr-calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  @Input("selectedDate") selectedDate: string;
  @Output() selectedDateChange = new EventEmitter();
  @Output() togglecalendar = new EventEmitter();
  @Output() closePopOverOnOutsideCick = new EventEmitter();
  ngbPopoverRef: any;
  calCurrSelectedDate: NgbDateStruct;
  today: number;
  minDateVal: NgbDateStruct;
  maxDateVal: NgbDateStruct;
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  formattedDate: string;
  dateReviewAuditType: string;
  isCalendarDateClicked: boolean = false;
  datePcikerRef: any;
  preSelectedDateType: string;

  readonly REVIEW: string = 'review';
  readonly AUDIT: string = 'audit';

  dateTypes = [{
    value: 'review',
    label: 'REVIEW'
  },
  {
    value: 'audit',
    label: 'AUDIT'
  }];

  constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef, private calendar: NgbCalendar) { }

  ngOnInit() {
    if (!this.dateReviewAuditType) {
      this.dateReviewAuditType = this.REVIEW;
    }
    if (!this.selectedDate) {
      this.dateTypeSelectionChanged(this.REVIEW);
    }
  }

  ngAfterViewInit() {
    if (this.datePcikerRef) {
      if (this.dateReviewAuditType === this.REVIEW) {
        if (this.calCurrSelectedDate) {
          this.datePcikerRef.navigateTo(this.calCurrSelectedDate);
          this.cdr.detectChanges();
        }
      } else if (this.dateReviewAuditType === this.AUDIT) {
        if (this.fromDate) {
          this.datePcikerRef.navigateTo(this.fromDate);
          this.cdr.detectChanges();
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName == "selectedDate") {
        let change = changes[propName];
        let curVal = change.currentValue;
        let prevVal = change.previousValue;
        if (curVal) {
          if (curVal.indexOf("-") > 0) {
            this.dateReviewAuditType = "audit";
            let inputfromDate = curVal.substring(0, 8);
            let inputToDate = curVal.substring(9);
            if (inputfromDate) {
              let auditFromNgbDate = this.getNgbDateFromStringDate(inputfromDate);
              this.checkFutureDate(auditFromNgbDate);
              this.checkFromDateValidity(auditFromNgbDate);
              this.fromDate = auditFromNgbDate;
            }
            if (inputToDate) {
              let auditToNgbDate = this.getNgbDateFromStringDate(inputToDate);
              this.checkFutureDate(auditToNgbDate);
              this.toDate = auditToNgbDate;
            }
            if (inputfromDate && inputToDate) {
              this.preSelectedDateType = this.AUDIT;
              this.dateTypeSelectionChanged(this.AUDIT);
              let isValid = this.daysDiffernceValid(this.fromDate, this.toDate);
              if (isValid) {
                this.formattedDate = this.getDisplayableDate(this.fromDate) + '-' + this.getDisplayableDate(this.toDate);
              }
            }
          } else {
            this.preSelectedDateType = this.REVIEW;
            this.dateTypeSelectionChanged(this.REVIEW);
            let reivewNgbDate = this.getNgbDateFromStringDate(curVal);
            this.calCurrSelectedDate = reivewNgbDate;
          }
        }
      }
    }
  }

  onDateSelection(inputdate: NgbDateStruct) {
    this.isCalendarDateClicked = true;
    let date: NgbDateStruct = inputdate;
    this.formattedDate = "";
    if (this.dateReviewAuditType === this.REVIEW) {
      this.toDate = null;
      this.fromDate = null;
      this.hoveredDate = null;
      this.formattedDate = this.getDisplayableDate(date);
      this.selectedDateChange.emit(this.formattedDate);
    } else if (this.dateReviewAuditType === this.AUDIT) {
      this.fromDate = date;
      let tempFromDate: Date = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      tempFromDate = this.getBackDatedDateByDays(tempFromDate, tempFromDate.getDay());
      this.fromDate = this.covertDateTONgbDateStruct(tempFromDate);
      let tempToDate: Date = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day); tempToDate = this.getFutureDatedDateByDays(tempToDate, 6);
      let tempNgbToDate: NgbDateStruct = this.covertDateTONgbDateStruct(tempToDate);
      this.toDate = tempNgbToDate;
      this.checkFutureDate(tempNgbToDate);
      if (this.fromDate) {
        this.checkFromDateValidity(this.fromDate);
      }
      if (this.toDate) {
        this.checkFutureDate(this.toDate);
      }
      if (this.fromDate && this.toDate) {
        let isValid = this.daysDiffernceValid(this.fromDate, this.toDate);
        if (isValid) {
          this.formattedDate = this.getDisplayableDate(this.fromDate) + '-' + this.getDisplayableDate(this.toDate);
          this.selectedDateChange.emit(this.formattedDate);
        }
      }
    }
  }

  dateTypeRadioSelectionChanged(dateType: any) {
    this.dateTypeSelectionChanged(dateType);
  }

  dateTypeSelectionChanged(selectedVal: string) {
    this.dateReviewAuditType = selectedVal;
    this.formattedDate = "";
    this.calCurrSelectedDate = null;
    if (this.dateReviewAuditType === this.REVIEW) {
      let date: Date = this.getBackDatedDateByDays(new Date(), 1);
      let maxDate: NgbDateStruct = this.covertDateTONgbDateStruct(date);
      this.maxDateVal = maxDate;
      let reviewdate: Date = this.getPreviousSpecifiedWorkingsDaysBackDate();
      let minDate: NgbDateStruct = this.covertDateTONgbDateStruct(reviewdate);
      this.minDateVal = minDate;
    } else if (this.dateReviewAuditType === this.AUDIT) {
      let date: Date = this.getAuditMaxDate();
      let maxDate1: NgbDateStruct = this.covertDateTONgbDateStruct(date);
      this.maxDateVal = maxDate1;
      let auditdate: Date = this.getAuditMaxDate();
      auditdate.setFullYear(auditdate.getFullYear() - 1);
      auditdate = this.getAuditDateByYearBack(auditdate);
      let minDate1: NgbDateStruct = this.covertDateTONgbDateStruct(auditdate);
      this.minDateVal = minDate1;
    }
  }



  getMinDateVal() {
    return this.minDateVal;
  }

  getMaxDateVal(datePicker: any) {
    if (datePicker) {
      this.datePcikerRef = datePicker;
    }
    return this.maxDateVal;
  }

  prependZeroForMonthORDate(dateOrMonthVal: number): string {
    let dateOrMonthStr = dateOrMonthVal.toString();
    if (dateOrMonthStr.length < 2) {
      dateOrMonthStr = '0' + dateOrMonthStr;
    }
    return dateOrMonthStr;
  }

  daysDiffernceValid(fromDate: NgbDateStruct, toDate: NgbDateStruct) {
    if (fromDate && toDate) {
      let fromDateJS: Date = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
      let toDateJS: Date = new Date(toDate.year, toDate.month - 1, this.toDate.day);
      var timeDiff = Math.abs(toDateJS.getTime() - fromDateJS.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays !== 6) {
        this.toDate = null;
        this.fromDate = null;
        this.hoveredDate = null;
        return false;
      }
      return true;
    }
  }

  checkFromDateValidity(fromDate: NgbDateStruct) {
    let currentDate: Date = new Date();
    let selectedFromDate: Date = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
    var timeDiff = Math.abs(currentDate.getTime() - selectedFromDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let currWeekDay = currentDate.getDay();
    if (diffDays <= currWeekDay) {
      this.toDate = null;
      this.fromDate = null;
      this.hoveredDate = null;
      return false;
    }
    return true;
  }

  getNgbDateFromStringDate(strDate: string) {
    let year = Number(strDate.substring(0, 4));
    let month = Number(strDate.substring(4, 6));
    let date = Number(strDate.substring(6, 8));
    let ngbDate: NgbDateStruct = this.covertStringTONgbDateStruct(year, month, date);
    return ngbDate;
  }

  isHovered = function (inputdate: NgbDateStruct) {
    let date: NgbDateStruct = this.covertStringTONgbDateStruct(inputdate.year, inputdate.month, inputdate.day);
    let tempFromDate: Date = this.fromDate ? new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day) : null;
    let tempHoveredDate: Date = this.hoveredDate ? new Date(this.hoveredDate.year, this.hoveredDate.month - 1, this.hoveredDate.day) : null;
    let tempinputDate: Date = new Date(date.year, date.month - 1, date.day);
    if (tempFromDate && tempHoveredDate && tempinputDate) {
      return this.fromDate && !this.toDate && this.hoveredDate && tempinputDate.getTime() > (tempFromDate.getTime()) && tempinputDate.getTime() < (tempHoveredDate.getTime());
    }
    return false;
  }.bind(this);

  isInside = function (inputdate: NgbDateStruct) {
    let date: NgbDateStruct = this.covertStringTONgbDateStruct(inputdate.year, inputdate.month, inputdate.day);//new NgbDateStruct(inputdate.year, inputdate.month, inputdate.day);
    let tempFromDate: Date = this.fromDate ? new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day) : null;
    let tempToDate: Date = this.toDate ? new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day) : null;
    let tempinputDate: Date = new Date(date.year, date.month - 1, date.day);
    if (tempFromDate && tempToDate && tempinputDate) {
      return tempinputDate.getTime() > (tempFromDate.getTime()) && tempinputDate.getTime() < (tempToDate.getTime())
    }
    return false;
  }.bind(this);

  isRange = function (inputdate: NgbDateStruct) {
    let date: NgbDateStruct = this.covertStringTONgbDateStruct(inputdate.year, inputdate.month, inputdate.day);//new NgbDateStruct(inputdate.year, inputdate.month, inputdate.day);
    let tempFromDate: Date = this.fromDate ? new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day) : null;
    let tempToDate: Date = this.toDate ? new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day) : null;
    let tempinputDate: Date = new Date(date.year, date.month - 1, date.day);
    if (tempFromDate && tempToDate && tempinputDate) {
      return tempinputDate.getTime() === tempFromDate.getTime() || tempinputDate.getTime() === tempToDate.getTime() || this.isInside(date) || this.isHovered(date)
    }
    return false
  }.bind(this);

  isMouseAction = function (inputdate: NgbDateStruct) {
    if (inputdate) {
      let date: NgbDateStruct = this.covertStringTONgbDateStruct(inputdate.year, inputdate.month, inputdate.day);
      this.hoveredDate = date;
    }
    this.hoveredDate = null;
  }.bind(this);

  isWeekendsDisabled = function (inputdate: NgbDateStruct) {
    if (inputdate) {
      let date: NgbDateStruct = this.covertStringTONgbDateStruct(inputdate.year, inputdate.month, inputdate.day);
      if (this.isWeekend(date)) {
        return true;
      }
    }
    return false;
  }.bind(this);

  isEligibleForDisableReview = function (date: NgbDateStruct) {
    if (this.isWeekend(date)) {
      return true;
    }
    return false;
  }.bind(this);

  isEligibleForDisableAudit(date: NgbDateStruct) {
    return false;
  }

  isWeekend(date: NgbDateStruct) {
    let tempinputDate: Date = new Date(date.year, date.month - 1, date.day);
    return tempinputDate.getDay() === 0 || tempinputDate.getDay() === 6;
  }

  getAuditMaxDate() {
    let tempDate: Date = new Date();
    if (tempDate.getDay() !== 6) {
      return this.getBackDatedDateByDays(tempDate, tempDate.getDay() + 1);
    } else {
      return tempDate;
    }
  }

  getAuditDateByYearBack(date: Date) {
    if (date.getDay() !== 0) {
      return this.getBackDatedDateByDays(date, date.getDay());
    } else {
      return date;
    }
  }

  checkFutureDate(ngbDate: NgbDateStruct) {
    let date: Date = new Date();
    let tempInputDate: Date = ngbDate ? new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day) : null;
    let currDate: NgbDateStruct = this.covertDateTONgbDateStruct(date);
    if (tempInputDate && tempInputDate.getTime() > date.getTime()) {
      this.toDate = null;
      this.fromDate = null;
      this.hoveredDate = null;
    }
  }

  getPreviousSpecifiedWorkingsDaysBackDate(): Date {
    let previousdayDate: Date = this.getBackDatedDateByDays(new Date(), 1);
    let workingDaysCounter: number = 0;
    while (true) {
      let weekDay = previousdayDate.getDay();
      if (weekDay !== 0 && weekDay !== 6) {
        workingDaysCounter = workingDaysCounter + 1;
      }
      if (workingDaysCounter >= REVIEW_DAYS_ELIGIBLE) {
        break;
      }
      previousdayDate = this.getBackDatedDateByDays(previousdayDate, 1);
    }
    return previousdayDate;
  }

  closeCalendarPopup() {
    this.togglecalendar.emit("close");
  }

  getBackDatedDateByDays(inputDate: Date, backDays: number) {
    let onedayOffset = backDays * (24 * 60 * 60 * 1000);
    inputDate.setTime(inputDate.getTime() - onedayOffset);
    return inputDate;
  }

  getFutureDatedDateByDays(inputDate: Date, backDays: number) {
    let onedayOffset = backDays * (24 * 60 * 60 * 1000);
    inputDate.setTime(inputDate.getTime() + onedayOffset);
    return inputDate;
  }

  getDisplayableDate(inputDate: NgbDateStruct) {
    if (inputDate) {
      let monthVal = this.prependZeroForMonthORDate(inputDate.month);
      let dayVal = this.prependZeroForMonthORDate(inputDate.day);
      return inputDate.year + monthVal + dayVal;
    }
    return "";
  }

  covertDateTONgbDateStruct(date: Date): NgbDateStruct {
    return date ? {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    } : null;
  }

  covertStringTONgbDateStruct(year: number, month: number, date: number): NgbDateStruct {
    return date ? {
      year: year,
      month: month,
      day: date
    } : null;
  }

  handleKeyPress(event: any) {
    event.preventDefault();
  }

  inputFieldFocused(event: any, selectinputfield: any) {
    event.preventDefault();
    selectinputfield.blur();

  }
  closeResult: string;
  model: NgbDateStruct;
  date: { year: number, month: number };



  selectToday() {
    this.model = this.calendar.getToday();
  }
  
  
  getJSTime(inputDate: Date){
	  
  }




}



