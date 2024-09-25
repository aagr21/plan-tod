import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  readonly dialog = inject(MatDialog);
  router = inject(Router);

  ngOnInit(): void {
    if (!this.authService.isTokenExpired()) {
      this.router.navigate(['']);
      return;
    }

    const dialogRef = this.dialog.open(LoginDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {},
    });
  }
}
