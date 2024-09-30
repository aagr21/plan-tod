import { AccessedFileLog } from "./accessed-file-log";

export interface Directory {
    id:                 number;
    name:               string;
    isFile:             boolean;
    children:           Directory[];
    path:               string;
    accessedFilesLogs?: AccessedFileLog[];
}
