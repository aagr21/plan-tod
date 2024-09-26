import { Institution } from './institution';

export interface Credential {
  id?: number;
  password?: string;
  institution?: Institution;
}
