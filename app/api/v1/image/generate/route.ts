import { NextResponse } from "next/server";
import { ofetch } from "ofetch";
import { getCategoryAndStyleType, StyleCategory, StyleCategoryID, StyleType } from "@/lib/utils-image-style";

type Params = {
	image: string;
	categoryId: number;
	styleId: number;
	prompt?: string;
};

export async function POST(req: Request) {
	const params: Params = await req.json();
	if (!params.image) {
		return NextResponse.json({ status: 400, message: "Parameters is missing." });
	}

	let category: StyleCategory = {
		id: params.categoryId,
		name: "Custom",
	};
	let style: StyleType | null = {
		id: params.styleId,
		name: "Style",
	};
	if (params.categoryId === StyleCategoryID.None) {
		// Custom prompt
		if (!params.prompt) {
			return NextResponse.json({ status: 400, message: "Parameters is missing." });
		}
		style.prompt = params.prompt;
	} else {
		const { category: categoryTmp, style: styleTmp } = getCategoryAndStyleType(params.categoryId, params.styleId);
		if (categoryTmp) category = categoryTmp;
		style = styleTmp;
		if (!style) return NextResponse.json({ status: 400, message: "Style is invalid." });
		style.prompt = style.prompt + "\n" + params.prompt;
	}

	try {
		const payload = {
			image_url: params.image,
			prompt: style.prompt!,
		};

		const { request_id } = await ofetch("https://queue.fal.run/fal-ai/gemini-flash-edit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Key ${process.env.FAL_API_KEY}`,
			},
			body: payload,
		});
		const requestId = request_id;

		let resultUrl = null;
		await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds
		while (true) {
			const { status } = await ofetch(`https://queue.fal.run/fal-ai/gemini-flash-edit/requests/${requestId}/status`, {
				headers: {
					Authorization: `Key ${process.env.FAL_API_KEY}`,
				},
			});
			if (status === "COMPLETED") {
				const { images } = await ofetch(`https://queue.fal.run/fal-ai/gemini-flash-edit/requests/${requestId}`, {
					headers: {
						Authorization: `Key ${process.env.FAL_API_KEY}`,
					},
				});
				resultUrl = images[0].url;
				break;
			} else if (status === "IN_PROGRESS" || status === "IN_QUEUE") {
			} else {
				throw new Error(`Failed to generate image.`);
			}

			await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds
		}

		return NextResponse.json({ message: "Success", resultUrl: resultUrl });
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ status: 500, error: error.message });
	}
}
