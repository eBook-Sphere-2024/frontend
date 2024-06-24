import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private subject = new BehaviorSubject<any>(null);

    emit(eventName: string, payload: any) {
        this.subject.next({ eventName, payload });
    }

    listen(eventName: string, callback: (event: any) => void) {
        this.subject.asObservable().subscribe((nextObj: any) => {
            if (nextObj && nextObj.eventName === eventName) {
                callback(nextObj.payload);
            }
        });
    }

  emitNavigation(url: string) {
    this.emit('navigation', url);
  }

  onNavigation(callback: (url: string) => void) {
    this.listen('navigation', callback);
  }
}
