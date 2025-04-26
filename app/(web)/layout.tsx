import { Header } from "@/components/navigate/header";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			{children}
		</div>
	);
}
