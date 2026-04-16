export interface Device {
  serial: string;
  state: string;
  product?: string;
  model?: string;
  device?: string;
  transportId?: string;
}

export interface AddDeviceInput {
  address: string; // IP:port format
}

export interface EnableTcpipInput {
  serial: string;
  port?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
