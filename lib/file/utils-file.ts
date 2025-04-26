import { ofetch } from "ofetch";
import { getNanoId } from "../utils";

/**
 * Get file extension
 */
export const getFileExtension = (fileUrl: string) => {
	const extension = fileUrl.split(".").pop()?.split("?")[0];
	if (!extension) {
		throw new Error("Invalid file URL");
	}
	return extension;
};

export const fileToBase64 = (file: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
			} else {
				reject(new Error("Failed to convert file to base64"));
			}
		};
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
};

export const urlToBase64 = async (url: string): Promise<string> => {
	const blob = await ofetch(url, {
		responseType: "blob",
	});
	return await fileToBase64(blob);
};

/**
 * Download image from base64
 */
export const downloadImageFromBase64 = async (base64Data: string, fileName?: string) => {
	if (!base64Data) return;
	if (!fileName) fileName = `${getNanoId(6)}`;

	try {
		// Extract the mime type and base64 content
		const [header, content] = base64Data.split(",");
		const mimeType = header.match(/data:(.*?);/)?.[1] || "image/png";
		const extension = mimeType.split("/")[1];

		// Convert base64 to blob
		const byteCharacters = atob(content);
		const byteArrays = new Uint8Array(byteCharacters.length);

		for (let i = 0; i < byteCharacters.length; i++) {
			byteArrays[i] = byteCharacters.charCodeAt(i);
		}

		const blob = new Blob([byteArrays], { type: mimeType });
		const url = URL.createObjectURL(blob);

		// Create and trigger download
		const a = document.createElement("a");
		a.href = url;
		a.download = `${fileName}.${extension}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Download image failed:", error);
		throw error;
	}
};
