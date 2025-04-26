import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

if (process.env.NODE_ENV === "development") {
	initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
	headers: async () => [
		{
			source: "/:path*",
			headers: [
				{
					key: "frame-ancestors",
					value: "none",
				},
			],
		},
	],
};

export default nextConfig;
