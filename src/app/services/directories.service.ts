import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Directory } from '@models/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DirectoriesService {
  http = inject(HttpClient);
  private _currentDirectoryBS = new BehaviorSubject<Directory>(undefined!);
  private _navigationDirectoryBS = new BehaviorSubject<Directory[]>([]);

  get navigationDirectory() {
    return this._navigationDirectoryBS.getValue();
  }

  get navigationDirectory$() {
    return this._navigationDirectoryBS.asObservable();
  }

  get path() {
    return this._navigationDirectoryBS
      .getValue()
      .map((element) => element.name)
      .join('/');
  }

  addDirToNav(directory: Directory) {
    const navDir = this._navigationDirectoryBS.getValue();
    navDir.push(directory);
    this._navigationDirectoryBS.next(navDir);
    this._currentDirectoryBS.next(directory);
  }

  navToRoot() {
    this._navigationDirectoryBS.next([]);
    this._currentDirectoryBS.next(undefined!);
  }

  removeDirToNav() {
    const navDir = this._navigationDirectoryBS.getValue();
    navDir.pop()!;

    // Actualizamos el BehaviorSubject con el nuevo array
    this._navigationDirectoryBS.next(navDir);

    const currentDir = navDir[navDir.length - 1];
    this._currentDirectoryBS.next(currentDir!);
  }

  get currentDirectory$() {
    return this._currentDirectoryBS.asObservable();
  }

  get currentDirectory() {
    return this._currentDirectoryBS.getValue();
  }

  setCurrentDirectory(directory: Directory) {
    this._currentDirectoryBS.next(directory!);
  }

  private _allDirectoriesBS = new BehaviorSubject<Directory[]>([]);

  get allDirectories$() {
    return this._allDirectoriesBS.asObservable();
  }

  setAllDirectories(allDirectories: Directory[]) {
    this._allDirectoriesBS.next(allDirectories);
  }

  findAll() {
    return this.http.get<Directory[]>(`${environment.apiBaseUrl}/directories`);
  }

  findLogs(directory: Directory) {
    return this.http.get<Directory>(
      `${environment.apiBaseUrl}/directories/find-logs/${directory.id}`
    );
  }
}
