import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { ApplicationService } from '../../services/application.service';
import { User, Payment } from '../../models/user.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  amount: number = 49;
  paymentInitiated = false;
  paymentError = '';
  currentUser: User | null = null;
  razorpayPaymentId: string = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser$().subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.initializePayment();
      }
    });
  }

  initializePayment(): void {
    if (this.currentUser) {
      this.paymentService.initiatePayment(this.currentUser.id).subscribe({
        next: (payment) => {
          this.razorpayPaymentId = payment.razorpayOrderId || '';
          this.paymentInitiated = true;
          this.loadRazorpayScript();
        },
        error: () => {
          this.paymentError = 'Failed to initialize payment. Please try again.';
        },
      });
    }
  }

  loadRazorpayScript(): void {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      this.openRazorpayModal();
    };
    script.onerror = () => {
      this.paymentError = 'Failed to load payment gateway. Please try again.';
    };
    document.body.appendChild(script);
  }

  openRazorpayModal(): void {
    if (this.currentUser && (window as any).Razorpay) {
      const options = {
        key: 'rzp_test_1DP5MMOk9HZ9WX', // Replace with your actual Razorpay key
        amount: this.amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Corporate Naukri',
        description: 'Job Placement Service',
        order_id: this.razorpayPaymentId,
        handler: this.handlePaymentSuccess.bind(this),
        prefill: {
          email: this.currentUser.email,
          contact: this.currentUser.phone || '',
        },
        theme: {
          color: '#667eea',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  }

  handlePaymentSuccess(response: any): void {
    if (this.currentUser) {
      // Mark payment as completed
      this.paymentService.completePayment(this.currentUser.id).subscribe({
        next: () => {
          // Create application record
          this.applicationService.createApplication(this.currentUser!.id).subscribe({
            next: () => {
              this.router.navigate(['/progress']);
            },
            error: () => {
              this.paymentError = 'Failed to create application. Please contact support.';
            },
          });
        },
        error: () => {
          this.paymentError = 'Failed to process payment. Please try again.';
        },
      });
    }
  }

  retryPayment(): void {
    this.paymentError = '';
    this.paymentInitiated = false;
    this.initializePayment();
  }

  goBack(): void {
    this.router.navigate(['/landing']);
  }
}
