import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { Subscription } from 'rxjs';
import { Directory, DecodedToken } from '@models/interfaces';
import { DirectoriesService } from '@services/directories.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AccessedFilesLogsService } from '@services/accessed-files-logs.service';
import { publicIpv4 } from 'public-ip';
import { AuthService } from '@services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    NgxSpinnerModule,
    HeaderComponent,
  ],
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
  deviceService = inject(DeviceDetectorService);
  accessedFilesLogsService = inject(AccessedFilesLogsService);
  authService = inject(AuthService);
  isLoading = false;
  spinner = inject(NgxSpinnerService);

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
    this.directoriesService.setCurrentDirectoryParent(undefined!);
    this.directoriesService.setCurrentDirectoryChild(undefined!);
    this.directoriesService.setCurrentDirectory(undefined!);
    this.directoriesService.setAllDirectories([]);
    this.directoriesService.setListNavigateDirectories([]);
  }

  changeCurrentDirectory(currentDirectory: Directory) {
    this.directoriesService.setCurrentDirectoryChild(currentDirectory);
  }

  async viewFile(directory: Directory) {
    this.isLoading = true;
    this.spinner.show();
    const deviceInfo = this.deviceService.getDeviceInfo();
    const accessedIp = await publicIpv4();
    const decodedToken = this.authService.decodeToken(
      this.authService.getToken()!
    ) as DecodedToken;
    const institutionId = decodedToken.data.credential.institution!.id!;
    const directoryId = this.currentDirectory!.id;

    this.accessedFilesLogsService
      .createAccessedFileLog({
        accessedDevice: deviceInfo.os,
        accessedBrowser: deviceInfo.browser,
        accessedIp,
        institutionId,
        directoryId
      })
      .subscribe({
        next: (_) => {
          this.isLoading = false;
          this.spinner.hide();
          window.open('//' + this.getUrl(directory), '_blank');
        },
        error: (_) => {
          this.isLoading = false;
          this.spinner.hide();
        },
      });
  }

  getUrl(directory: Directory) {
    return `mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/aagr21/tod-files/main/${this.directoriesService.pathCurrentDirectory}/${directory.name}`;
  }
}
