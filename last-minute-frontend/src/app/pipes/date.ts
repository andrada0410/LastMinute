import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'date'
})
export class DatePipe implements PipeTransform {
    transform(value: any, format: string = 'dd.MM.yyyy HH:mm'): string {
        if (!value) {
            return '';
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return '';
        }

        const pad = (n: number) => n.toString().padStart(2, '0');

        const tokens: { [key: string]: string } = {
            'yyyy': date.getFullYear().toString(),
            'yy': date.getFullYear().toString().slice(-2),
            'MM': pad(date.getMonth() + 1),
            'dd': pad(date.getDate()),
            'HH': pad(date.getHours()),
            'mm': pad(date.getMinutes()),
            'ss': pad(date.getSeconds())
        };

        return format.replace(/yyyy|yy|MM|dd|HH|mm|ss/g, (match) => {
            return tokens[match];
        });
    }
}