import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TermsBottomSheetComponent } from '../terms-bottom-sheet/terms-bottom-sheet.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TermsBottomSheetComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showTerms = false;
  loginError = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  toggleTerms(): void {
    this.showTerms = !this.showTerms;
  }

  closeTerms(): void {
    this.showTerms = false;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe((user) => {
        if (user) {
          this.router.navigate(['/landing']);
        } else {
          this.loginError = 'Invalid email or password';
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get termsAccepted() {
    return this.loginForm.get('termsAccepted');
  }
}
