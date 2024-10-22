import { AccessedFileLog } from './accessed-file-log';

export interface Directory {
  id?:                  number;
  name?:                string;
  children?:            Directory[];
  files?:               File[];
  path?:                string;
  accessedFilesLogs?:   AccessedFileLog[];
}
