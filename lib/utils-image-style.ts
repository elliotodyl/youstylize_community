// photo style category
export enum StyleCategoryID {
	None = 0, // prompt only
	Cartoon = 10,
	ActionFigure = 11,
	Sketch = 12,
	Artist = 13,
	Art = 14,
}
export type StyleCategory = {
	id: number;
	name: string;
};

// photo style model
export enum PhotoStyleID {
	None = 0, // prompt only
	Cartoon = 1000,
	Ghibli = 1001,
	Lego = 1002,
	Anime = 1003,
	ActionFigure1 = 1100,
}
export type StyleType = {
	id: number;
	name: string;
	prompt?: string;
	previewImageShort?: string;
};
export type PhotoStyleType = {
	category: StyleCategory;
	style: StyleType[];
	promptPlaceholder?: string;
};
export const getPhotoStyleTypes: PhotoStyleType[] = [
	{
		promptPlaceholder: "Add specific instructions for the Al (e.g., Make it more colorful)",
		category: {
			id: StyleCategoryID.Cartoon,
			name: "Cartoon",
		},
		style: [
			{
				id: PhotoStyleID.Cartoon,
				name: "Cartoon",
				prompt: "Create a cartoon version of this image",
			},
			{
				id: PhotoStyleID.Ghibli,
				name: "Ghibli",
				prompt: "restyle image in studio Ghibli style keep all details",
			},
			{
				id: PhotoStyleID.Lego,
				name: "Lego",
				prompt: "restyle image in Lego style, colorful, detailed, 3D-like",
			},
			{
				id: PhotoStyleID.Anime,
				name: "Anime",
				prompt: "restyle image in Anime style keep all details",
			},
		],
	},
	{
		promptPlaceholder: `Add specific instructions for the Al (e.g., On top of the box, write "[TITLE]". The accessories include [ACCESSORIES].)
		`,
		category: {
			id: StyleCategoryID.ActionFigure,
			name: "Action Figure",
		},
		style: [
			{
				id: PhotoStyleID.ActionFigure1,
				name: "Action Figure",
				prompt: "Draw an action figure toy of the person in this photo. The figure should be full figure, matched the exact facial features and outfit, and displayed in it original blister pack packaging. In the blister pack packaging, next to the figure show 3-5 the toy's accessories inspired by the person's outfit or items in the photo, ensuring no accessories are body parts. This figure should look like a premium toy and everything should be inside the plastic",
			},
		],
	},
];
export const getStyleType = (categoryId: number, styleId: number): StyleType | null => {
	const photoStyle = getPhotoStyleTypes.find((photoStyle) => photoStyle.category.id === categoryId);
	if (!photoStyle) {
		return null;
	}
	return photoStyle.style.find((style) => style.id === styleId) ?? null;
};
export const getCategoryAndStyleType = (categoryId: number, styleId: number): { category: StyleCategory | null; style: StyleType | null } => {
	const photoStyle = getPhotoStyleTypes.find((photoStyle) => photoStyle.category.id === categoryId);
	if (!photoStyle) {
		return { category: null, style: null };
	}
	const style = photoStyle.style.find((style) => style.id === styleId) ?? null;
	return { category: photoStyle.category, style };
};

export type PhotoCategoryIdAndStyle = {
	categoryId: number;
	style: StyleType;
};
export const getPhotoCategoryIdAndStyle = (categoryId: number, styleId: number): PhotoCategoryIdAndStyle | null => {
	if (categoryId === StyleCategoryID.None) {
		return {
			categoryId: StyleCategoryID.None,
			style: { id: PhotoStyleID.None, name: "Custom" },
		};
	}
	const style = getStyleType(categoryId, styleId);
	if (style) {
		return { categoryId: categoryId, style };
	}
	return null;
};
