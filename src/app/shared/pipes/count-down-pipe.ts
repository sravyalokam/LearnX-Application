import { Pipe, PipeTransform } from '@angular/core';
import { Observable, timer, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform {

  private getMsDiff = (futureDate: string): number => (+(new Date(futureDate)) - Date.now());

  private msToTime(msRemaining: number): string {
    const days: string | number = Math.floor(Math.abs(msRemaining) / (1000 * 60 * 60 * 24));
    let hours: string | number = Math.floor((Math.abs(msRemaining) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes: string | number = Math.floor((Math.abs(msRemaining) % (1000 * 60 * 60)) / (1000 * 60));
    let seconds: string | number = Math.floor((Math.abs(msRemaining) % (1000 * 60)) / 1000);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    if (msRemaining < 0) {
      return `-${days}:${hours}:${minutes}:${seconds}`;
    } else {
      return `${days}:${hours}:${minutes}:${seconds}`;
    }
  }

  public transform(futureDate: string, isPaused: boolean = false): Observable<string> | null {
    if (!futureDate) {
      return null;
    }
    let msRemaining = this.getMsDiff(futureDate);
    const countdownSubject = new BehaviorSubject<string>(this.msToTime(msRemaining));

    if(!isPaused){
      timer(0, 1000)
        .pipe(
          map(() => {
            msRemaining -= 1000;
            const countdown =  this.msToTime(msRemaining);
            countdownSubject.next(countdown);
          })
        )
        .subscribe();
    }


    return countdownSubject.asObservable();
  }
}