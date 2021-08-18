import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "cut",
})
export class CutPipe implements PipeTransform {
  transform(value: any, notAllowdDay: string) {
    if (value.lengh === 0) {
      return value;
    }

    const days = [];
    for (const day of value) {
      if (day !== notAllowdDay) {
        days.push(day);
      }
    }
    return days;    
  }
}
