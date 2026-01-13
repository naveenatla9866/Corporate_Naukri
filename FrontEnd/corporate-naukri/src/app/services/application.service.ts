import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationStatus } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private applicationStatus$ = new BehaviorSubject<ApplicationStatus | null>(null);

  constructor() {}

  getApplicationStatus$(): Observable<ApplicationStatus | null> {
    return this.applicationStatus$.asObservable();
  }

  createApplication(userId: string): Observable<ApplicationStatus> {
    return new Observable((observer) => {
      const application: ApplicationStatus = {
        id: uuidv4(),
        userId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: this.generateReferralCode(),
      };
      localStorage.setItem(`application_${userId}`, JSON.stringify(application));
      this.applicationStatus$.next(application);
      observer.next(application);
      observer.complete();
    });
  }

  getApplicationByUserId(userId: string): Observable<ApplicationStatus | null> {
    return new Observable((observer) => {
      const application = localStorage.getItem(`application_${userId}`);
      if (application) {
        const parsedApplication = JSON.parse(application);
        this.applicationStatus$.next(parsedApplication);
        observer.next(parsedApplication);
      } else {
        observer.next(null);
      }
      observer.complete();
    });
  }

  updateApplicationStatus(
    userId: string,
    status: ApplicationStatus['status']
  ): Observable<ApplicationStatus> {
    return new Observable((observer) => {
      const application = localStorage.getItem(`application_${userId}`);
      if (application) {
        const parsedApplication = JSON.parse(application);
        parsedApplication.status = status;
        parsedApplication.updatedAt = new Date();
        localStorage.setItem(`application_${userId}`, JSON.stringify(parsedApplication));
        this.applicationStatus$.next(parsedApplication);
        observer.next(parsedApplication);
      }
      observer.complete();
    });
  }

  getReferralCode(userId: string): string {
    const application = localStorage.getItem(`application_${userId}`);
    if (application) {
      const parsedApplication = JSON.parse(application);
      return parsedApplication.referralCode || '';
    }
    return '';
  }

  private generateReferralCode(): string {
    return 'REF' + Math.random().toString(36).substring(2, 15).toUpperCase();
  }
}
