import { Inter, Comic_Neue } from "next/font/google";

export const fontSans = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});
export const fontHeading = Comic_Neue({
	weight: ["300", "400", "700"],
	subsets: ["latin"],
	variable: "--font-heading",
});
