import { Component, Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {

    en: {
        weekdays: [ 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa','Su'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'oct', 'Nov', 'Dec'],
    },
    fr: {
        weekdays: ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam','dim'],
        months: ['janv', 'fevr', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec'],

    }
};

@Injectable()
export class I18n {
    language = 'en';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    constructor(private _i18n: I18n) {
        super();
    }

    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
    }

    getMonthShortName(month: number): string {
        return I18N_VALUES[this._i18n.language].months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }
    getDayAriaLabel(date: NgbDateStruct): string{
      return '$(date.day)-${date.month}-$(date.year}';
    }
}
