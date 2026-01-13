import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.currentUser$.next(user);
        this.isAuthenticatedSubject$.next(true);
      }
    }
  }

  getCurrentUser$(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject$.asObservable();
  }

  register(email: string, password: string, termsAccepted: boolean): Observable<User> {
    return new Observable((observer) => {
      const user: User = {
        id: uuidv4(),
        email,
        password,
        termsAccepted,
      };

      if (this.isBrowser) {
        localStorage.setItem(`user_${email}`, JSON.stringify(user));
        localStorage.setItem('currentUser', JSON.stringify(user));
      }

      this.currentUser$.next(user);
      this.isAuthenticatedSubject$.next(true);

      observer.next(user);
      observer.complete();
    });
  }

  login(email: string, password: string): Observable<User | null> {
    return new Observable((observer) => {
      if (!this.isBrowser) {
        observer.next(null);
        observer.complete();
        return;
      }

      const storedUser = localStorage.getItem(`user_${email}`);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.password === password) {
          this.currentUser$.next(user);
          this.isAuthenticatedSubject$.next(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
          observer.next(user);
        } else {
          observer.next(null);
        }
      } else {
        observer.next(null);
      }

      observer.complete();
    });
  }

  logout(): void {
    this.currentUser$.next(null);
    this.isAuthenticatedSubject$.next(false);

    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
  }

  updateUserProfile(
    name: string,
    phone: string,
    age: number,
    resume: File
  ): Observable<User> {
    return new Observable((observer) => {
      const currentUser = this.currentUser$.value;

      if (currentUser) {
        currentUser.name = name;
        currentUser.phone = phone;
        currentUser.age = age;
        currentUser.resume = resume;

        this.currentUser$.next(currentUser);

        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          localStorage.setItem(
            `user_${currentUser.email}`,
            JSON.stringify(currentUser)
          );
        }

        observer.next(currentUser);
      }

      observer.complete();
    });
  }
}
