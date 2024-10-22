import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { DirectoriesService } from '@services/directories.service';
import { Directory } from '@models/interfaces';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  directoriesService = inject(DirectoriesService);
  currentDirectory?: Directory;
  router = inject(Router);

  ngOnInit(): void {
    this.directoriesService.currentDirectory$.subscribe({
      next: (data) => {
        this.currentDirectory = data;
      },
    });
  }

  back() {
    this.directoriesService.removeDirToNav();
  }

  singOut() {
    this.authService.signOut();
    this.router.navigate(['login']);
  }
}
