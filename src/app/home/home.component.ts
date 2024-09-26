import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MainContentComponent } from '@home/main-content/main-content.component';
import { DirectoriesService } from '@services/directories.service';
import { Directory } from '@models/interfaces';
import { SidebarComponent } from '@home/sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatSidenavModule,
    MainContentComponent,
    SidebarComponent,
    NgxSpinnerModule,
  ],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  directoriesService = inject(DirectoriesService);
  currentDirectory?: Directory;
  allDirectories: Directory[] = [];
  private subscription!: Subscription;
  breakpointObserver = inject(BreakpointObserver);
  isSmallScreen = false;
  spinner = inject(NgxSpinnerService);
  isLoading = false;

  ngOnInit(): void {
    this.subscription = this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .subscribe({
        next: (result) => {
          this.isSmallScreen = result.matches;
        },
      });

    this.isLoading = true;
    this.spinner.show();

    this.directoriesService.findAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.spinner.hide();
        this.allDirectories = response;
        this.directoriesService.setAllDirectories(this.allDirectories);
      },
      error: (_) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
