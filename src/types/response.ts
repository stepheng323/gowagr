export interface IServiceHelper<T = any> {
  status:
    | 'successful'
    | 'created'
    | 'deleted'
    | 'conflict'
    | 'bad-request'
    | 'forbidden'
    | 'not-found';
  message: string;
  meta?: any;
  data?: T;
}
