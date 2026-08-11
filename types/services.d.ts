export type ServiceResult<T = unknown> =
  | {status: "success"; message: string; data?: T}
  | {status: "failed"; message: string}