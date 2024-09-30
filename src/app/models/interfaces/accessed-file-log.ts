import { Institution } from './institution';

export interface AccessedFileLog {
    id?:                number;
    accessedDevice?:    string;
    accessedIp?:        string;
    accessedBrowser?:   string;
    institution?:       Institution;
    accessedAt?:        Date;
}
