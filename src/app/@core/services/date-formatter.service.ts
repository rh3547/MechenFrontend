import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class CustomDateFormatter extends NgbDateParserFormatter {
    // from input -> internal model
    parse(value: string): NgbDateStruct {
        if (!/[*]*[-\/]+[*]*/.test(value) && value.length == 8) {
            return { year: Number(value.substr(4, 4)), month: Number(value.substr(0, 2)), day: Number(value.substr(2, 2)) } as NgbDateStruct;
        }
        else {
            let date = moment(value);

            if (date != null && date.isValid()) {
                return { year: date.get("year"), month: date.get("month") + 1, day: date.get("date") } as NgbDateStruct;
            }
            else {
                return null;
            }
        }
    }

    // from internal model -> string
    format(value: NgbDateStruct): string {
        if (value != null) {
            let date = moment(`${value.month}/${value.day}/${value.year}`);
            return (date != null) ? date.format("MM/DD/YYYY") : "";
        }
        else {
            return "";
        }
    }
}