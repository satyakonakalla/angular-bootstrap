import { Injectable } from '@angular/core';
import { CANADA_HOLIDAYS } from '../data/canada';

@Injectable()
export class HolidayService {
    constructor() {}
    isHoliday(countryCode:string, month:number, date:number):boolean {

        let canadaHolidays: any[] = CANADA_HOLIDAYS;
        let filteredHolidays = [];

        if(canadaHolidays.length > 0){
            for(let i=0; i< canadaHolidays.length; i++){
                filteredHolidays = canadaHolidays.filter(holiday => {
                    if(holiday && holiday.month == month && holiday.date == date ){
                        return true;
                    }else{
                        return false;
                    }                     
                });                                                             
            }
        }         
        if(filteredHolidays.length == 0){
            return false;
        }else{
            return true;
        }         
    }
}