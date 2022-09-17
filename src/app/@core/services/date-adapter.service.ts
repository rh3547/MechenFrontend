import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class CustomDateAdapter extends NgbDateAdapter<string> {
    // from your model -> internal model
    fromModel(value: string): NgbDateStruct {
        if (!value) return null;

        if (!/[*]*[-\/]+[*]*/.test(value) && value.length == 8) {
            return { year: Number(value.substr(0, 4)), month: Number(value.substr(4, 2)), day: Number(value.substr(6, 2)) } as NgbDateStruct;
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

    // from internal model -> your model
    toModel(value: NgbDateStruct): string {
        if (value != null) {
            let date = moment(`${value.month}/${value.day}/${value.year}`);
            return (date != null) ? date.toISOString() : "";
        }
        else {
            return "";
        }
    }
}