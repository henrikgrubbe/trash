import {Service} from "../model/service";
import {NodeType, parse} from 'node-html-parser';
import {DateTime} from "luxon";

enum EnvVar {
    CALENDAR_URL = 'CALENDAR_URL',
    CALENDAR_BODY = 'CALENDAR_BODY',
    NOTIFY_URL = 'NOTIFY_URL'
}

type CalendarEvent = { date: DateTime, event: string };

export class CalendarService implements Service {
    public readonly name = 'Calendar';
    public readonly environmentVariables = Object.keys(EnvVar);

    private calendarUrl;
    private calendarBody;
    private notifyUrl;

    public init(envVars: Record<EnvVar, string>): Promise<void> {
        this.calendarUrl = envVars.CALENDAR_URL;
        this.calendarBody = envVars.CALENDAR_BODY;
        this.notifyUrl = envVars.NOTIFY_URL;

        return this.fetchCalendarEvents().then();
    }

    public destruct(): Promise<void> {
        return Promise.resolve();
    }

    public fetchCalendarAndNotify(): void {
        this.fetchCalendarEvents()
            .then(calendarEvents => calendarEvents
                .filter(CalendarService.calendarEventRelevant)
                .forEach(this.notify));
    }

    private fetchCalendarEvents(): Promise<CalendarEvent[]> {
        return this.fetchCalendarText()
            .then(responseText => this.parseCalendarText(responseText));
    }

    private static calendarEventRelevant(event: CalendarEvent): boolean {
        const daysInFuture = event.date.diffNow('days').days;

        return daysInFuture > 0 && daysInFuture <= 1;
    }

    private fetchCalendarText(): Promise<string> {
        const options = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: this.calendarBody,
            method: 'POST'
        };

        return fetch(this.calendarUrl, options)
            .then(response => {
                if (response.ok) {
                    console.log('Successfully fetched calendar');
                }
                return response;
            })
            .then(response => response.text());
    }

    private parseCalendarText(calendarText: string): CalendarEvent[] {
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

        console.log(`${result.length} events successfully parsed:`);
        result
            .map(CalendarService.calendarEventToString)
            .forEach(x => console.log(x));

        return result;
    }

    private static parseDateString(dateString: string): DateTime {
        let dateTime = DateTime.fromFormat(dateString, 'dd-MM');
        if (dateTime.diffNow('month').months <= -6) {
            dateTime = dateTime.plus({year: 1});
        }

        return dateTime;
    }

    private notify(calendarEvent: CalendarEvent): void {
        const body = {
            title: 'Trash event coming up',
            body: CalendarService.calendarEventToString(calendarEvent)
        };

        const options = {
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(body),
            method: 'POST'
        };

        fetch(this.notifyUrl, options)
            .then(response => {
                if (response.ok) {
                    console.log('Successfully sent notification');
                }
                return response;
            })
            .then(response => response.text())
            .catch(error => console.error('error', error));
    }

    private static calendarEventToString(calendarEvent: CalendarEvent): string {
        return `${calendarEvent.event} on ${calendarEvent.date.toFormat('dd/MM/yy')}`
    }
}
