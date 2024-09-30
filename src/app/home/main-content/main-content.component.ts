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
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    NgxSpinnerModule,
    HeaderComponent,
    MatButtonModule,
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
    const directoryId = directory.id;

    this.accessedFilesLogsService
      .createAccessedFileLog({
        accessedDevice: deviceInfo.os,
        accessedBrowser: deviceInfo.browser,
        accessedIp,
        institutionId,
        directoryId,
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

  viewHistory(file: Directory) {
    this.isLoading = true;
    this.spinner.show();
    this.directoriesService.findLogs(file).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.spinner.hide();
        const doc = new jsPDF();
        doc.setLineHeightFactor(1.5);
        doc.setFontSize(12);
        doc.setFont(undefined!, 'bold');

        // Agregar título al PDF
        doc.text(response.name.split('.pdf')[0], 16, 16, {
          maxWidth: 180,
        });

        const url = this.getUrl(file);

        doc.textWithLink('Ver documento', 16, 33, {
          url: `https://redirection-doc-pdf-plan-tod.vercel.app/api/redirection?link=${encodeURIComponent(url)}`,
        });

        // Crear la tabla
        autoTable(doc, {
          head: [
            ['Institución', 'Dispositivo', 'Navegador', 'IP', 'Fecha y Hora'],
          ],
          body: response.accessedFilesLogs!.map((e) => [
            e.institution!.name!,
            e.accessedDevice!,
            e.accessedBrowser!,
            e.accessedIp!,
            moment(e.accessedAt!).format('DD/MM/YYYY HH:mm:ss'),
          ]),
          startY: 40,
        });

        doc.save(
          `Historial de accesos a ${file.name.split('.pdf')[0]} - ${moment(
            Date.now()
          ).format('DD/MM/YYYY HH:mm:ss')}.pdf`
        );
      },
      error: (_) => {
        console.clear();
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  getUrl(directory: Directory) {
    return `mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/aagr21/tod-files/main/${this.directoriesService.pathCurrentDirectory}/${directory.name}`;
  }

  onRightClick() {
    return false;
  }
}
