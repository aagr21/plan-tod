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

  get currentDirectory$() {
    return this._currentDirectoryBS.asObservable();
  }

  get currentDirectory() {
    return this._currentDirectoryBS.getValue();
  }

  setCurrentDirectoryChild(currentDirectory: Directory) {
    this._listNavigateDirectoriesBS.next([
      ...this._listNavigateDirectoriesBS.getValue(),
      this.currentDirectory,
    ]);
    this._currentDirectoryBS.next(currentDirectory);
    if (!this._currentDirectoryBS.getValue()) {
      this._pathCurrentDirectoryBS.next(undefined!);
      return;
    }
    if (!this._pathCurrentDirectoryBS.getValue()) {
      this._pathCurrentDirectoryBS.next(currentDirectory.name);
    } else {
      this._pathCurrentDirectoryBS.next(
        `${this._pathCurrentDirectoryBS.getValue()}/${currentDirectory.name}`
      );
    }
  }

  setCurrentDirectoryParent(currentDirectory: Directory) {
    this._currentDirectoryBS.next(currentDirectory);
    if (!this._currentDirectoryBS.getValue()) {
      this._pathCurrentDirectoryBS.next(undefined!);
      return;
    }
    this._pathCurrentDirectoryBS.next(currentDirectory.name);
  }

  private _listNavigateDirectoriesBS = new BehaviorSubject<Directory[]>([]);

  get listNavigateDirectories$() {
    return this._listNavigateDirectoriesBS.asObservable();
  }

  get listNavigateDirectories() {
    return this._listNavigateDirectoriesBS.getValue();
  }

  setListNavigateDirectories(directories: Directory[]) {
    this._listNavigateDirectoriesBS.next(directories);
  }

  popListNavigateDirectories() {
    const directory = this.listNavigateDirectories.pop();
    this._listNavigateDirectoriesBS.next(this.listNavigateDirectories);
    return directory;
  }

  private _parentDirectoryBS = new BehaviorSubject<Directory>(undefined!);

  get parentDirectory$() {
    return this._parentDirectoryBS.asObservable();
  }

  get parentDirectory() {
    return this._parentDirectoryBS.getValue();
  }

  setParentDirectory(directory: Directory) {
    this._parentDirectoryBS.next(directory);
  }

  private _pathCurrentDirectoryBS = new BehaviorSubject<string>(undefined!);

  get pathCurrentDirectory() {
    return this._pathCurrentDirectoryBS.getValue();
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
}
