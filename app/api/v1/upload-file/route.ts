import { NextResponse } from "next/server";
import { createR2Url } from "@/server/r2.server";
import { getUUIDString } from "@/lib/utils";

interface Params {
	fileExtension: string | undefined | null;
	contentType: string | undefined | null;
}
export async function POST(req: Request) {
	const params: Params = await req.json();
	if (!params.fileExtension || !params.contentType) {
		return NextResponse.json({ status: 400, message: "Parameters is missing." });
	}

	const fileId = getUUIDString();
	const filename = fileId + params.fileExtension;
	let url_suffix = filename;

	try {
		const signedUrl = await createR2Url(url_suffix, params.contentType as string);
		const fileUrl = `${process.env.CLOUDFLARE_R2_CUSTOM_HOST}/${url_suffix}`;
		return NextResponse.json({ status: 200, url: signedUrl, method: "PUT", file_url: fileUrl });
	} catch (error: any) {
		return NextResponse.json({ status: 500, message: error.message || "Failed to upload file." });
	}
}
