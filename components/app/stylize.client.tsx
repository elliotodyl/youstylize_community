"use client";

import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, SparklesIcon, ArrowUpFromLine, FlipHorizontal, UploadIcon, Info } from "lucide-react";
import { SubmitButton } from "@/components/ui/submit-button";
import { ofetch } from "ofetch";
import { handleError } from "@/@types/error";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getUploadS3Url, handleFileUploadWithProgress } from "@/lib/file/upload-file";
import { getPhotoCategoryIdAndStyle, getPhotoStyleTypes, PhotoCategoryIdAndStyle, PhotoStyleID, StyleCategoryID } from "@/lib/utils-image-style";
import { Hint } from "@/components/ui/custom/hint";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadImageFromBase64, fileToBase64, urlToBase64 } from "@/lib/file/utils-file";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/custom/dropzone";

export default function StylizeClient({ categoryId = StyleCategoryID.Cartoon, styleId = PhotoStyleID.Ghibli }: { categoryId?: number; styleId?: number }) {
	const [prompt, setPrompt] = useState("");
	const [selectStyle, setSelectStyle] = useState<PhotoCategoryIdAndStyle | null>(getPhotoCategoryIdAndStyle(categoryId, styleId));

	const [originImage, setOriginImage] = useState<string | null>(null);
	const [previewImageBase64, setPreviewImageBase64] = useState<string | null>(null);
	const [originImageBase64, setOriginImageBase64] = useState<string | null>(null);
	const [uploadingOriginImage, setUploadingOriginImage] = useState<boolean>(false);
	const [uploadingOriginImageProgress, setUploadingOriginImageProgress] = useState<number>(0);
	const handleLocalFileDrop = async (files: File[]) => {
		setUploadingOriginImageProgress(0);
		setPreviewImageBase64(null);
		setOriginImage(null);
		setOriginImageBase64(null);

		if (!files || files.length === 0) return;

		try {
			setUploadingOriginImage(true);

			const { uploadUrl, method, file_url } = await getUploadS3Url(files[0]);
			if (!uploadUrl) {
				throw new Error("Failed to upload image.");
			}
			await handleFileUploadWithProgress({
				file: files[0],
				uploadUrl,
				method,
				setUploadFileProgress: setUploadingOriginImageProgress,
			});
			setOriginImage(file_url);

			const base64 = await fileToBase64(files[0]);
			setOriginImageBase64(base64);
		} catch (error: any) {
			console.error("Failed to upload image:", error.message);
			toast.error(`Upload image failed: ${error.message}`);
		} finally {
			setUploadingOriginImage(false);
		}
	};
	const [submitting, setSubmitting] = useState(false);
	const [seconds, setSeconds] = useState<string>("0.0");
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
	useEffect(() => {
		if (submitting) {
			const id = setInterval(() => {
				setSeconds((prevSeconds) => (Number(prevSeconds) + 0.1).toFixed(1));
			}, 100);
			setIntervalId(id);
		} else if (intervalId) {
			setSeconds("0.0");
			clearInterval(intervalId);
			setIntervalId(null);
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [submitting]);
	const handleGenerateImage = async () => {
		if (!originImage) {
			return;
		}
		let promtpTrim = prompt.trim();
		if (selectStyle?.categoryId === StyleCategoryID.None) {
			if (promtpTrim.length === 0) return;
		}

		try {
			setPreviewImageBase64(null);
			setSubmitting(true);
			const { status, message, resultUrl } = await ofetch("/api/v1/image/generate", {
				method: "POST",
				body: {
					image: originImage,
					categoryId: selectStyle?.categoryId,
					styleId: selectStyle?.style.id,
					prompt: promtpTrim,
				},
			});
			handleError(status, message);

			if (resultUrl) {
				const base64 = await urlToBase64(resultUrl);
				setPreviewImageBase64(base64);
			}
			toast.success("Generate success.");
		} catch (error: any) {
			console.error("Failed to generate image:", error.message);
			toast.error("Generate failed.");
		} finally {
			setSubmitting(false);
		}
	};

	const [isComparing, setIsComparing] = useState<boolean>(false);
	const [downloading, setDownloading] = useState(false);

	return (
		<div className="flex w-full flex-col items-center gap-6 px-4 pb-4 pt-6 md:px-6 md:pb-6">
			<div className="flex w-full flex-col gap-3 md:flex-row">
				<div className="flex flex-col justify-center rounded-lg bg-white md:w-2/3">
					<div className="relative flex w-full flex-col justify-center gap-1">
						<div className="flex aspect-square max-h-[520px] items-center justify-center">
							{previewImageBase64 && originImageBase64 ? (
								<img
									src={isComparing ? originImageBase64 : previewImageBase64}
									alt=""
									className="h-full w-full object-contain"
									onContextMenu={(e) => e.preventDefault()}
									onDragStart={(e) => e.preventDefault()}
								/>
							) : originImageBase64 ? (
								<img
									src={originImageBase64}
									alt=""
									className="h-full w-full object-contain"
									onContextMenu={(e) => e.preventDefault()}
									onDragStart={(e) => e.preventDefault()}
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center rounded">
									<Dropzone
										multiple={false}
										maxFiles={1}
										onDrop={handleLocalFileDrop}
										accept={{
											"image/jpeg": [".jpg", ".jpeg", ".png", ".webp"],
										}}
										onError={console.error}
										className="h-full whitespace-pre-wrap border-none shadow-none hover:bg-white"
									>
										<DropzoneEmptyState>
											<>
												{uploadingOriginImage ? (
													<p className="font-normal">Uploading {uploadingOriginImageProgress}%</p>
												) : (
													<>
														<div className={cn(buttonVariants(), "h-10 bg-teal-500 hover:bg-teal-500")}>
															<UploadIcon />
															Upload your photo
														</div>
														<p className="my-2 w-full text-sm font-normal text-muted-foreground">Or drop an image</p>
													</>
												)}
											</>
										</DropzoneEmptyState>
										<DropzoneContent />
									</Dropzone>
								</div>
							)}
						</div>
						<div className="absolute bottom-2 right-2 z-10 flex items-center gap-1">
							{originImageBase64 && previewImageBase64 && (
								<Hint label="Hold to compare" sideOffset={10}>
									<Button
										size="icon"
										variant="outline"
										className="shrink-0"
										onMouseDown={() => setIsComparing(true)}
										onMouseUp={() => setIsComparing(false)}
										onMouseLeave={() => setIsComparing(false)}
									>
										<FlipHorizontal />
									</Button>
								</Hint>
							)}
							{previewImageBase64 && (
								<Hint label="Export image" sideOffset={10}>
									<div className="relative">
										<SubmitButton
											isSubmitting={downloading}
											disabled={!previewImageBase64}
											size="icon"
											variant="outline"
											className="shrink-0"
											onClick={async () => {
												try {
													setDownloading(true);
													await downloadImageFromBase64(previewImageBase64);
												} catch (error) {
													console.error("Failed to download image:", error);
												} finally {
													setDownloading(false);
												}
											}}
										>
											<Download />
										</SubmitButton>
									</div>
								</Hint>
							)}
							{originImage && (
								<Dropzone
									multiple={false}
									maxFiles={1}
									onDrop={handleLocalFileDrop}
									accept={{
										"image/jpeg": [".jpg", ".jpeg", ".png", ".webp"],
									}}
									onError={console.error}
									className="border-none bg-transparent p-0 shadow-none"
								>
									<DropzoneEmptyState>
										<Hint label="Reupload" sideOffset={10}>
											<div className={cn(buttonVariants({ size: "icon", variant: "outline" }))}>
												<ArrowUpFromLine />
											</div>
										</Hint>
									</DropzoneEmptyState>
									<DropzoneContent />
								</Dropzone>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-shrink-0 flex-grow flex-col gap-4 rounded-lg bg-white p-4 md:p-6">
					<div className="flex w-full flex-col">
						<div className="text-sm font-medium">Style</div>
						<Tabs defaultValue={String(selectStyle?.categoryId)}>
							<TabsList className="gap-2 bg-transparent p-0 text-neutral-500">
								{getPhotoStyleTypes.map((photoStyle) => (
									<TabsTrigger
										key={photoStyle.category.id}
										value={String(photoStyle.category.id)}
										className="rounded-full border px-2 py-0.5 text-[13px] font-normal shadow-none hover:bg-zinc-100 data-[state=active]:bg-teal-500 data-[state=active]:text-white data-[state=active]:shadow-none"
									>
										{photoStyle.category.name}
									</TabsTrigger>
								))}
								<TabsTrigger
									value={String(StyleCategoryID.None)}
									className="rounded-full border px-2 py-0.5 text-[13px] font-normal shadow-none hover:bg-zinc-100 data-[state=active]:bg-teal-500 data-[state=active]:text-white data-[state=active]:shadow-none"
									onClick={() =>
										setSelectStyle({
											categoryId: StyleCategoryID.None,
											style: { id: PhotoStyleID.None, name: "Custom" },
										})
									}
								>
									Custom
								</TabsTrigger>
							</TabsList>

							{getPhotoStyleTypes.map((photoStyle) => (
								<TabsContent key={photoStyle.category.id} value={String(photoStyle.category.id)} className="mt-1">
									<div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4">
										{photoStyle.style.map((style) => (
											<div key={style.id} className="flex w-[68px] flex-col items-center">
												<div
													className={cn(
														"h-[68px] w-[68px] cursor-pointer overflow-hidden rounded-lg bg-teal-50",
														style.id === selectStyle?.style.id && "bg-teal-200 p-0.5 outline outline-teal-500",
													)}
													onClick={() =>
														setSelectStyle({
															categoryId: photoStyle.category.id,
															style: style,
														})
													}
												></div>
												<p className="mt-1 w-full text-center text-[10px] font-normal text-neutral-900">{style.name}</p>
											</div>
										))}
									</div>
									<div>
										<div className="my-2 text-sm font-medium">
											Prompt<span className="text-xs font-normal text-muted-foreground"> (Optional)</span>
										</div>
										<Textarea
											rows={3}
											placeholder={photoStyle.promptPlaceholder}
											className="resize-none placeholder:text-xs"
											value={prompt}
											maxLength={500}
											onChange={(e) => setPrompt(e.target.value)}
										/>
									</div>
								</TabsContent>
							))}

							<TabsContent value={String(StyleCategoryID.None)} className="mt-0">
								<div className="mb-2 text-sm font-medium">Prompt</div>
								<Textarea
									rows={4}
									placeholder='Enter a custom style description, such as "sketch style" or "sci-fi style"'
									className="resize-none"
									value={prompt}
									maxLength={500}
									onChange={(e) => setPrompt(e.target.value)}
								/>
							</TabsContent>
						</Tabs>

						<SubmitButton
							isSubmitting={submitting}
							variant="default"
							disabled={!originImage || submitting || (selectStyle?.categoryId === StyleCategoryID.None && prompt.trim().length === 0)}
							className="mt-4 w-full bg-teal-500 hover:bg-teal-500"
							onClick={handleGenerateImage}
						>
							<SparklesIcon />
							Generate
						</SubmitButton>
					</div>
				</div>
			</div>
		</div>
	);
}
