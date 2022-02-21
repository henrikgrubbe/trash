import fetch from 'node-fetch';
import {Service} from "../model/service";


export class CalendarService {

    private address!: string;

    public readonly service: Service = {
        name: 'Calendar',
        initFunction: this.initService.bind(this),
        destructFunction: async () => {},
        environmentVariables: [
            'ADDRESS',
        ]
    };

    private initService(): Promise<void> {
        this.address = process.env.ADDRESS;

        this.getCalendar();

        return Promise.resolve();
    }

    public getCalendar() {
        fetch('https://www.seerupit.com/toemningskalender/silkeborg/showInfo.php', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: `values=N%C3%A5rupvej%7C21%7C%7C%7C%7C8883%7CGjern%7C22050160%7C784231%7C0`,
            method: "POST"
        })
            .then(response => response.text())
            .then(text => {
                console.log(text);
            })
    }
}



