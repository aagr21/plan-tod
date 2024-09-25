import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MainContentComponent } from './main-content/main-content.component';
import { DirectoriesService } from '@services/directories.service';
import { Directory } from '@models/interfaces';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSidenavModule, MainContentComponent, SidebarComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  directoriesService = inject(DirectoriesService);
  currentDirectory?: Directory;
  allDirectories: Directory[] = [];

  ngOnInit(): void {
    this.directoriesService.findAll().subscribe({
      next: (response) => {
        this.allDirectories = response;
        this.directoriesService.setAllDirectories(this.allDirectories);
      },
    });
  }
}
