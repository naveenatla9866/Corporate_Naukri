# Corporate Naukri - API & Services Documentation

## Service Architecture

### 1. AuthService

**Location**: `src/app/services/auth.service.ts`

#### Methods

##### `register(email: string, password: string, termsAccepted: boolean): Observable<User>`
Creates a new user account.

**Parameters:**
- `email` - User email address
- `password` - User password (min 6 characters)
- `termsAccepted` - Boolean for terms acceptance

**Returns:** Observable<User>

**Example:**
```typescript
this.authService.register('user@example.com', 'password123', true).subscribe(
  (user: User) => {
    console.log('Registration successful', user);
  }
);
```

---

##### `login(email: string, password: string): Observable<User | null>`
Authenticates user with email and password.

**Parameters:**
- `email` - User email
- `password` - User password

**Returns:** Observable<User | null>

**Example:**
```typescript
this.authService.login('user@example.com', 'password123').subscribe(
  (user: User | null) => {
    if (user) {
      console.log('Login successful');
    } else {
      console.log('Invalid credentials');
    }
  }
);
```

---

##### `logout(): void`
Logs out the current user.

**Parameters:** None

**Returns:** void

**Example:**
```typescript
this.authService.logout();
```

---

##### `updateUserProfile(name: string, phone: string, age: number, resume: File): Observable<User>`
Updates user profile information.

**Parameters:**
- `name` - Full name
- `phone` - Phone number (10 digits)
- `age` - Age (18-65)
- `resume` - PDF file object

**Returns:** Observable<User>

**Example:**
```typescript
this.authService.updateUserProfile(
  'John Doe',
  '9876543210',
  25,
  resumeFile
).subscribe(
  (user: User) => {
    console.log('Profile updated', user);
  }
);
```

---

##### `getCurrentUser$(): Observable<User | null>`
Gets the current logged-in user as an observable.

**Parameters:** None

**Returns:** Observable<User | null>

**Example:**
```typescript
this.authService.getCurrentUser$().subscribe(
  (user: User | null) => {
    if (user) {
      console.log('Current user:', user);
    }
  }
);
```

---

##### `isAuthenticated$(): Observable<boolean>`
Checks if user is authenticated.

**Parameters:** None

**Returns:** Observable<boolean>

**Example:**
```typescript
this.authService.isAuthenticated$().subscribe(
  (isAuth: boolean) => {
    console.log('Is authenticated:', isAuth);
  }
);
```

---

### 2. PaymentService

**Location**: `src/app/services/payment.service.ts`

#### Methods

##### `getPaymentAmount(): number`
Returns the fixed payment amount.

**Returns:** number (49)

**Example:**
```typescript
const amount = this.paymentService.getPaymentAmount();
console.log('Amount:', amount); // 49
```

---

##### `initiatePayment(userId: string): Observable<Payment>`
Creates a payment order.

**Parameters:**
- `userId` - User ID

**Returns:** Observable<Payment>

**Example:**
```typescript
this.paymentService.initiatePayment('user123').subscribe(
  (payment: Payment) => {
    console.log('Payment initiated:', payment);
  }
);
```

---

##### `getPayment$(): Observable<Payment | null>`
Gets current payment as observable.

**Parameters:** None

**Returns:** Observable<Payment | null>

**Example:**
```typescript
this.paymentService.getPayment$().subscribe(
  (payment: Payment | null) => {
    if (payment) {
      console.log('Current payment:', payment);
    }
  }
);
```

---

##### `completePayment(userId: string): Observable<Payment>`
Marks payment as completed.

**Parameters:**
- `userId` - User ID

**Returns:** Observable<Payment>

**Example:**
```typescript
this.paymentService.completePayment('user123').subscribe(
  (payment: Payment) => {
    console.log('Payment completed:', payment);
  }
);
```

---

##### `getPaymentByUserId(userId: string): Observable<Payment | null>`
Retrieves payment details for a user.

**Parameters:**
- `userId` - User ID

**Returns:** Observable<Payment | null>

**Example:**
```typescript
this.paymentService.getPaymentByUserId('user123').subscribe(
  (payment: Payment | null) => {
    if (payment) {
      console.log('User payment:', payment);
    }
  }
);
```

---

### 3. ApplicationService

**Location**: `src/app/services/application.service.ts`

#### Methods

##### `createApplication(userId: string): Observable<ApplicationStatus>`
Creates a new application record.

**Parameters:**
- `userId` - User ID

**Returns:** Observable<ApplicationStatus>

**Example:**
```typescript
this.applicationService.createApplication('user123').subscribe(
  (app: ApplicationStatus) => {
    console.log('Application created:', app);
  }
);
```

---

##### `getApplicationByUserId(userId: string): Observable<ApplicationStatus | null>`
Retrieves application details.

**Parameters:**
- `userId` - User ID

**Returns:** Observable<ApplicationStatus | null>

**Example:**
```typescript
this.applicationService.getApplicationByUserId('user123').subscribe(
  (app: ApplicationStatus | null) => {
    if (app) {
      console.log('Application status:', app.status);
    }
  }
);
```

---

##### `updateApplicationStatus(userId: string, status: ApplicationStatus['status']): Observable<ApplicationStatus>`
Updates application status.

**Parameters:**
- `userId` - User ID
- `status` - New status ('pending' | 'resume_received' | 'forwarded_to_hr' | 'interview_scheduled')

**Returns:** Observable<ApplicationStatus>

**Example:**
```typescript
this.applicationService.updateApplicationStatus('user123', 'resume_received').subscribe(
  (app: ApplicationStatus) => {
    console.log('Status updated:', app.status);
  }
);
```

---

##### `getReferralCode(userId: string): string`
Gets the referral code for a user.

**Parameters:**
- `userId` - User ID

**Returns:** string

**Example:**
```typescript
const code = this.applicationService.getReferralCode('user123');
console.log('Referral code:', code); // REF...
```

---

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  age?: number;
  resume?: File;
  termsAccepted: boolean;
}
```

---

### ApplicationStatus Model
```typescript
interface ApplicationStatus {
  id: string;
  userId: string;
  status: 'pending' | 'resume_received' | 'forwarded_to_hr' | 'interview_scheduled';
  createdAt: Date;
  updatedAt: Date;
  referralCode?: string;
}
```

---

### Payment Model
```typescript
interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  createdAt: Date;
}
```

---

## Component Services Injection

### Example: LoginComponent
```typescript
import { AuthService } from '../../services/auth.service';

constructor(private authService: AuthService) {}
```

### Example: PaymentComponent
```typescript
import { PaymentService } from '../../services/payment.service';
import { ApplicationService } from '../../services/application.service';

constructor(
  private paymentService: PaymentService,
  private applicationService: ApplicationService
) {}
```

---

## LocalStorage Keys

| Key | Value | Description |
|-----|-------|-------------|
| `currentUser` | User object | Currently logged-in user |
| `user_[email]` | User object | Stored user by email |
| `application_[userId]` | ApplicationStatus | Application record |
| `payment_[userId]` | Payment | Payment details |

---

## API Flow Diagram

```
User Registration
    ↓
AuthService.register()
    ↓
Store in localStorage (user_[email])
    ↓
User Login
    ↓
AuthService.login()
    ↓
Set currentUser in localStorage
    ↓
Complete Profile
    ↓
AuthService.updateUserProfile()
    ↓
Initiate Payment
    ↓
PaymentService.initiatePayment()
    ↓
Razorpay Payment
    ↓
PaymentService.completePayment()
    ↓
ApplicationService.createApplication()
    ↓
Application Status Tracking
    ↓
ApplicationService.updateApplicationStatus()
```

---

## Common Use Cases

### User Registration Flow
```typescript
// 1. Register
this.authService.register(email, password, true).subscribe(() => {
  // 2. Redirect to landing
  this.router.navigate(['/landing']);
});
```

### Profile Completion Flow
```typescript
// 1. Update profile
this.authService.updateUserProfile(name, phone, age, resume).subscribe(() => {
  // 2. Initiate payment
  this.paymentService.initiatePayment(user.id).subscribe(() => {
    // 3. Load Razorpay
    this.loadRazorpayScript();
  });
});
```

### Application Tracking Flow
```typescript
// 1. Create application
this.applicationService.createApplication(userId).subscribe(() => {
  // 2. Get application status
  this.applicationService.getApplicationByUserId(userId).subscribe((app) => {
    console.log('Current status:', app.status);
  });
});

// 3. Update status (every 15 seconds in demo)
this.applicationService.updateApplicationStatus(userId, 'resume_received').subscribe();
```

### Referral Code Usage
```typescript
// 1. Get referral code
const code = this.applicationService.getReferralCode(userId);

// 2. Create referral link
const referralLink = `${window.location.origin}?ref=${code}`;

// 3. Share via WhatsApp
window.open(`https://wa.me/?text=${encodeURIComponent(referralLink)}`, '_blank');
```

---

## Error Handling

All services return Observables. Handle errors using:

```typescript
this.authService.login(email, password).subscribe({
  next: (user: User | null) => {
    console.log('Success');
  },
  error: (error: any) => {
    console.error('Error:', error);
  },
  complete: () => {
    console.log('Complete');
  }
});
```

---

## Testing Services

### Mock Data for Testing
```typescript
const mockUser: User = {
  id: '123',
  email: 'test@example.com',
  password: 'password123',
  name: 'John Doe',
  phone: '9876543210',
  age: 25,
  termsAccepted: true
};

const mockPayment: Payment = {
  id: '456',
  userId: '123',
  amount: 49,
  status: 'completed',
  razorpayOrderId: 'ORD123',
  createdAt: new Date()
};
```

---

## Performance Considerations

1. **Observables**: All services return Observables - remember to unsubscribe
2. **Storage**: localStorage is synchronous, avoid in loops
3. **API Calls**: Implement caching for production
4. **Memory**: Large file uploads should be optimized

---

## Future Enhancements

- [ ] Implement HTTP client for backend calls
- [ ] Add request/response interceptors
- [ ] Implement error interceptor
- [ ] Add loading state management
- [ ] Implement ngRx for state management
- [ ] Add offline support
- [ ] Implement service worker

---

For more details, refer to individual service files or component implementations.
