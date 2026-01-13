import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  landingForm!: FormGroup;
  selectedFile: File | null = null;
  submitError = '';
  submitSuccess = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.landingForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      resume: ['', Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.landingForm.patchValue({ resume: file.name });
      } else {
        this.submitError = 'Only PDF files are allowed for resume';
        this.selectedFile = null;
      }
    }
  }

  onSubmit(): void {
    if (this.landingForm.valid && this.selectedFile) {
      const { name, phone, age } = this.landingForm.value;
      
      this.authService.updateUserProfile(name, phone, age, this.selectedFile).subscribe({
        next: () => {
          this.submitSuccess = 'Profile updated successfully! Redirecting to payment...';
          setTimeout(() => {
            this.router.navigate(['/payment']);
          }, 1500);
        },
        error: () => {
          this.submitError = 'Failed to update profile. Please try again.';
        },
      });
    } else {
      this.submitError = 'Please fill all fields and select a valid PDF resume.';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get name() {
    return this.landingForm.get('name');
  }

  get phone() {
    return this.landingForm.get('phone');
  }

  get age() {
    return this.landingForm.get('age');
  }

  get resume() {
    return this.landingForm.get('resume');
  }
}
