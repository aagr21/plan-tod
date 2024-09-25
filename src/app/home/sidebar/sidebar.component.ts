import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DirectoriesService } from '@services/directories.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  directoriesService = inject(DirectoriesService);

  selectDocuments() {
    this.directoriesService.setCurrentDirectoryChild(undefined!);
    this.directoriesService.setListNavigateDirectories([]);
  }
}
