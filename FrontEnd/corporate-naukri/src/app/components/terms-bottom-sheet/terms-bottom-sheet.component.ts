import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-bottom-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-bottom-sheet.component.html',
  styleUrls: ['./terms-bottom-sheet.component.css'],
})
export class TermsBottomSheetComponent {
  @Output() onClose = new EventEmitter<void>();

  closeSheet(): void {
    this.onClose.emit();
  }
}
