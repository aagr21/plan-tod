import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { Subscription } from 'rxjs';
import { Directory } from '@models/interfaces';
import { DirectoriesService } from '@services/directories.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatCardModule, HeaderComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent implements OnInit, OnDestroy {
  isSmallScreen = false;
  private subscription!: Subscription;
  breakpointObserver = inject(BreakpointObserver);
  currentDirectory?: Directory;
  directoriesService = inject(DirectoriesService);
  allDirectories: Directory[] = [];

  ngOnInit(): void {
    this.subscription = this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .subscribe({
        next: (result) => {
          this.isSmallScreen = result.matches;
        },
      });

    this.directoriesService.allDirectories$.subscribe({
      next: (data) => {
        this.allDirectories = data;
      },
    });

    this.directoriesService.currentDirectory$.subscribe({
      next: (data) => {
        this.currentDirectory = data;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeCurrentDirectory(currentDirectory: Directory) {
    this.directoriesService.setCurrentDirectoryChild(currentDirectory);
  }

  viewFile(directory: Directory) {
    window.open('//' + this.getUrl(directory), '_blank');
  }

  getUrl(directory: Directory) {
    return `mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/aagr21/tod-files/main/${this.directoriesService.pathCurrentDirectory}/${directory.name}`;
  }

  // Método para manejar el hover sobre los archivos
  onHover(file: any, isHovered: boolean) {
    file.hover = isHovered;
  }
}
