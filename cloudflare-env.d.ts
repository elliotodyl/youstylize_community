declare namespace Cloudflare {
	interface Env {
		NEXTJS_ENV: string;
		ASSETS: Fetcher;
	}
}
interface CloudflareEnv extends Cloudflare.Env {}
