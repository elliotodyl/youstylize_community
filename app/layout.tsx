import "./globals.css";
import { fontHeading, fontSans } from "@/lib/fonts";
import { Toaster } from "@/components/ui/sonner";
import { CookiesProvider } from "next-client-cookies/server";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>

			<body className={`${fontSans.variable} font-sans ${fontHeading.variable}`}>
				<NextTopLoader color="#0d9488" initialPosition={0.3} speed={600} crawlSpeed={200} showSpinner={false} shadow={false} />
				<CookiesProvider>
					{children}
					<Toaster richColors position="top-center" />
				</CookiesProvider>
			</body>
		</html>
	);
}
