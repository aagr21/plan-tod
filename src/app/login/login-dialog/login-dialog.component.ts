import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  readonly dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  showPassword = false;
  authService = inject(AuthService);
  passwordControl = new FormControl('');
  isLoading = false;
  router = inject(Router);
  @ViewChild('myButton') myButton!: ElementRef;

  closeDialog() {
    this.dialogRef.close();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.passwordControl.value!.length > 0) {
      this.signIn();
    }
  }

  signIn() {
    this.isLoading = true;
    const password = this.passwordControl.value!;
    this.authService.signIn({ password }).subscribe({
      next: (response) => {
        this.closeDialog();
        this.isLoading = false;
        this.authService.saveToken(response.data.token);
        this.router.navigate(['']);
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
}
