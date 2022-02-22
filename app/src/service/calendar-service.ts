import fetch from 'node-fetch';
import {Service} from "../model/service";
import {NodeType, parse} from 'node-html-parser';
import {DateTime} from "luxon";


type CalendarEvent = { date: DateTime, event: string };

export class CalendarService {

    private static readonly CALENDAR_URL = 'https://www.seerupit.com/toemningskalender/silkeborg/showInfo.php';
    private static readonly NOTIFY_URL = 'https://notifications.ravnely.fantastiskefroe.dk/api/notifications/topic/trash';

    public readonly service: Service = {
        name: 'Calendar',
        initFunction: this.initService.bind(this),
        destructFunction: async () => {
        },
        environmentVariables: []
    };

    private initService(): Promise<void> {
        this.fetchCalendarAndNotify();

        return Promise.resolve();
    }

    public async fetchCalendarAndNotify() {
        const responseText = await CalendarService.getCalendarText();
        const calendarEvents = CalendarService.parseCalendarText(responseText);

        calendarEvents
            .filter(calendarEvent => calendarEvent.date.diffNow("days").days <= 1)
            .forEach(calendarEvent => this.notify(calendarEvent));
    }

    private static async getCalendarText(): Promise<string> {
        const options = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: `values=N%C3%A5rupvej%7C21%7C%7C%7C%7C8883%7CGjern%7C22050160%7C784231%7C0`,
            method: 'POST'
        };

        return fetch(CalendarService.CALENDAR_URL, options)
            .then(response => response.text());
    }

    private static parseCalendarText(calendarText: string): CalendarEvent[] {
        const result = [];
        const root = parse(calendarText);

        for (let tableRow of root.querySelectorAll('tr')) {
            const numChildren = tableRow
                .childNodes
                .filter(node => node.nodeType === NodeType.ELEMENT_NODE)
                .length;

            if (numChildren === 2) {
                const tableData = tableRow.childNodes
                    .filter(node => node.nodeType === NodeType.ELEMENT_NODE);

                result.push({
                    date: CalendarService.parseDateString(tableData[0].innerText),
                    event: tableData[1].innerText
                });
            }
        }

        return result;
    }

    private static parseDateString(dateString: string): DateTime {
        return DateTime.fromFormat(dateString, 'dd-MM');
    }

    private notify(calendarEvent: CalendarEvent): void {
        const body = {
            title: 'Trash event soon',
            body: CalendarService.calendarEventToString(calendarEvent)
        };

        const options = {
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(body),
            method: 'POST'
        };

        return fetch(CalendarService.NOTIFY_URL, options)
            .then(response => response.text())
            .catch(error => console.log('error', error));
    }

    private static calendarEventToString(calendarEvent: CalendarEvent): string {
        return `${calendarEvent.event} on ${calendarEvent.date.toFormat('dd/MM')}`
    }
}
