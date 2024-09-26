import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { AccessedFileLog, AccessedFileLogRequest } from '@models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AccessedFilesLogsService {
  http = inject(HttpClient);

  createAccessedFileLog(accessedFileLogRequest: AccessedFileLogRequest) {
    return this.http.post<AccessedFileLog>(
      `${environment.apiBaseUrl}/accessed-files-logs`,
      accessedFileLogRequest
    );
  }
}
