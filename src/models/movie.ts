export interface Movie {
  uid: string;
  pendingUpload: boolean;
  readyToStream: boolean;
  status: {
    state: string;
    pctComplete: string;
  };
}
