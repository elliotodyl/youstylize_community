import StylizeClient from "@/components/app/stylize.client";
import { PhotoStyleID, StyleCategoryID } from "@/lib/utils-image-style";

export default async function Page() {
	return (
		<main className="min-h-screen pb-20">
			<section>
				<div className="relative pb-20 pt-20">
					<div className="mx-auto max-w-5xl px-6">
						<div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
							<h1 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold lg:mt-16">
								Turn Your Photos Into{" "}
								<span className="bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">Magical Art</span>
							</h1>
						</div>
					</div>
				</div>
			</section>

			<div className="container w-full px-4">
				<div className="rounded-xl bg-muted">
					<StylizeClient categoryId={StyleCategoryID.Cartoon} styleId={PhotoStyleID.Ghibli} />
				</div>
			</div>
		</main>
	);
}
