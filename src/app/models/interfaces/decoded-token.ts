import { Credential } from "./credential";

export interface DecodedToken {
    data: Data;
    iat:  number;
    exp:  number;
}

export interface Data {
    credential: Credential;
}
