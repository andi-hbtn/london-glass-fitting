import { HttpException } from "@nestjs/common";

export class ServiceHandler extends HttpException {
	constructor(message: string, httpStatus: number) {
		super(message, httpStatus);
	}
}