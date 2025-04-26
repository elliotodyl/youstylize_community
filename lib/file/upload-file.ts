import { handleError } from "@/@types/error";
import { ofetch } from "ofetch";

export const getUploadS3Url = async (file: File): Promise<{ uploadUrl: string; method: string; file_url: string }> => {
	const fileExtension = file.name.split(".").pop();
	const { status, message, url, method, file_url } = await ofetch("/api/v1/upload-file", {
		method: "POST",
		body: { fileExtension: `.${fileExtension}`, contentType: file.type },
	});
	handleError(status, message);

	return { uploadUrl: url, method, file_url };
};

interface UploadProps {
	file: File;
	uploadUrl: string;
	method: string;
	setUploadFileProgress?: (progress: number) => void;
}
export const handleFileUploadWithProgress = async ({ file, uploadUrl, method, setUploadFileProgress }: UploadProps) => {
	try {
		return await new Promise<void>((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const loaded = event.loaded;
					const total = event.total;
					const percentage = Math.round((loaded / total) * 100);
					if (setUploadFileProgress) {
						setUploadFileProgress(percentage);
					}
				}
			};

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					console.log("Upload file success!");
					resolve(); // Resolve the promise on successful upload
				} else {
					reject(new Error(`Failed to upload file. Status: ${xhr.status}`)); // Reject on HTTP error
				}
			};

			xhr.onerror = () => {
				reject(new Error("Failed to upload file. Network error.")); // Reject on network error
			};

			xhr.open(method, uploadUrl);

			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target && event.target.result) {
					// Send the file content as binary data
					xhr.send(event.target.result);
				} else {
					reject(new Error("Failed to read file"));
				}
			};
			reader.onerror = () => {
				reject(new Error("Failed to read file"));
			};
			reader.readAsArrayBuffer(file);
		});
	} catch (error) {
		console.error("Error during file upload:", error);
		throw error;
	}
};
