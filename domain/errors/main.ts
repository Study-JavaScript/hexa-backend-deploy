// abstract class ErrorBase extends Error {
//     constructor(message: string, options?: ErrorOptions) {
//         super(message, options);
//       }
// }
abstract class ErrorBase extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
      }
}

export class SetEnvError extends ErrorBase {}
export class UnauthorizedError extends ErrorBase{}
export class UnauthenticatedError extends ErrorBase{}
export class FindDbError extends ErrorBase{}
export class InvalidUrlError extends ErrorBase{}