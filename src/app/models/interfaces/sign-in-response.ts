export interface SignInResponse {
  message: string;
  data: Data;
}

export interface Data {
  token: string;
  type: string;
}
