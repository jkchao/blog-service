export interface ResponseInterface<T = any> {
  readonly success: boolean;
  readonly message: string;
  readonly code: number;
  readonly data: T;
}
