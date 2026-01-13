import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { User, ApplicationStatus } from '../../models/user.model';
import { ReplacePipe } from '../../pipes/replace.pipe';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, ReplacePipe],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  currentUser: User | null = null;
  applicationStatus: ApplicationStatus | null = null;
  referralLink: string = '';
  showReferralModal = false;
  referralCopied = false;

  // Define progress steps
  steps = [
    { id: 1, label: 'Application Received', key: 'pending' },
    { id: 2, label: 'Resume Received', key: 'resume_received' },
    { id: 3, label: 'Forwarded to HR', key: 'forwarded_to_hr' },
    { id: 4, label: 'Interview Scheduled', key: 'interview_scheduled' },
  ];

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser$().subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadApplicationStatus(user.id);
      }
    });

    // Simulate progress updates every 10 seconds for demo purposes
    this.simulateProgress();
  }

  loadApplicationStatus(userId: string): void {
    this.applicationService.getApplicationByUserId(userId).subscribe((status) => {
      this.applicationStatus = status;
      if (status?.referralCode) {
        this.referralLink = `${window.location.origin}?ref=${status.referralCode}`;
      }
    });
  }

  simulateProgress(): void {
    setInterval(() => {
      if (this.applicationStatus && this.currentUser) {
        const currentStepIndex = this.steps.findIndex(
          (s) => s.key === this.applicationStatus!.status
        );
        if (currentStepIndex < this.steps.length - 1) {
          const nextStatus = this.steps[currentStepIndex + 1].key as ApplicationStatus['status'];
          this.applicationService
            .updateApplicationStatus(this.currentUser.id, nextStatus)
            .subscribe((updated) => {
              this.applicationStatus = updated;
            });
        }
      }
    }, 15000); // Update every 15 seconds
  }

  getProgressPercentage(): number {
    const stepIndex = this.steps.findIndex((s) => s.key === this.applicationStatus?.status);
    return stepIndex >= 0 ? ((stepIndex + 1) / this.steps.length) * 100 : 0;
  }

  isStepCompleted(stepKey: string): boolean {
    const currentStepIndex = this.steps.findIndex((s) => s.key === this.applicationStatus?.status);
    const checkStepIndex = this.steps.findIndex((s) => s.key === stepKey);
    return checkStepIndex <= currentStepIndex;
  }

  openReferralModal(): void {
    this.showReferralModal = true;
  }

  closeReferralModal(): void {
    this.showReferralModal = false;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.referralLink).then(() => {
      this.referralCopied = true;
      setTimeout(() => {
        this.referralCopied = false;
      }, 2000);
    });
  }

  shareOnWhatsApp(): void {
    const text = `Check out Corporate Naukri! I'm finding amazing job opportunities here. Use my referral code and get benefits: ${this.referralLink}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  }

  shareOnEmail(): void {
    const subject = 'Join Corporate Naukri - Job Placement Platform';
    const body = `Hi,\n\nI'm using Corporate Naukri for job placement and finding it really helpful. Check it out using my referral link:\n\n${this.referralLink}\n\nBest regards`;
    const encodedBody = encodeURIComponent(body);
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodedBody}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
