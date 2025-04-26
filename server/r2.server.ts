import { AwsClient } from "aws4fetch";

export async function createR2Url(path: string, contentType: string | null): Promise<string> {
	const R2_URL = `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`;
	const client = new AwsClient({
		service: "s3",
		region: "auto",
		accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
	});
	const presignedURL = (
		await client.sign(
			new Request(`${R2_URL}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${path}?X-Amz-Expires=${3600}`, {
				method: "PUT",
			}),
			{
				aws: { signQuery: true },
			},
		)
	).url.toString();

	return presignedURL;
}
