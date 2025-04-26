export class ParamsError extends Error {
	public readonly statusCode: number = 400;

	constructor(message: string) {
		super(message);
		this.name = "ParamsError";
	}
}
export class NotFoundError extends Error {
	public readonly statusCode: number = 404;

	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}
export class ServerError extends Error {
	public readonly statusCode: number = 500;

	constructor(message: string) {
		super(message);
		this.name = "ServerError";
	}
}
export const handleError = (status: number | undefined | null, message: string | undefined | null) => {
	if (!status) return;

	if (status === 200) return;

	switch (status) {
		case 400:
			throw new ParamsError(message as string);
		case 404:
			throw new NotFoundError(message as string);
		case 500:
			throw new ServerError(message as string);
		default:
			throw new Error(message as string);
	}
};
