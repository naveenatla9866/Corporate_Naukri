import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Payment } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private payment$ = new BehaviorSubject<Payment | null>(null);
  private readonly PAYMENT_AMOUNT = 49;

  constructor() {}

  getPaymentAmount(): number {
    return this.PAYMENT_AMOUNT;
  }

  initiatePayment(userId: string): Observable<Payment> {
    return new Observable((observer) => {
      const payment: Payment = {
        id: uuidv4(),
        userId,
        amount: this.PAYMENT_AMOUNT,
        status: 'pending',
        razorpayOrderId: 'ORD' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        createdAt: new Date(),
      };
      localStorage.setItem(`payment_${userId}`, JSON.stringify(payment));
      this.payment$.next(payment);
      observer.next(payment);
      observer.complete();
    });
  }

  getPayment$(): Observable<Payment | null> {
    return this.payment$.asObservable();
  }

  completePayment(userId: string): Observable<Payment> {
    return new Observable((observer) => {
      const payment = localStorage.getItem(`payment_${userId}`);
      if (payment) {
        const parsedPayment = JSON.parse(payment);
        parsedPayment.status = 'completed';
        localStorage.setItem(`payment_${userId}`, JSON.stringify(parsedPayment));
        this.payment$.next(parsedPayment);
        observer.next(parsedPayment);
      }
      observer.complete();
    });
  }

  getPaymentByUserId(userId: string): Observable<Payment | null> {
    return new Observable((observer) => {
      const payment = localStorage.getItem(`payment_${userId}`);
      if (payment) {
        const parsedPayment = JSON.parse(payment);
        this.payment$.next(parsedPayment);
        observer.next(parsedPayment);
      } else {
        observer.next(null);
      }
      observer.complete();
    });
  }
}
