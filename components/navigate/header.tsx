"use client";

import React, { useState } from "react";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { NoPrefetchLink } from "@/components/ui/no-prefetch-link";
import { WEBNAME } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface MenuItem {
	name: string;
	href?: string;
	icon?: React.ReactNode;
	target?: string;
	hidden?: boolean;
	items?: {
		name: string;
		href: string;
		description?: string;
		image?: string;
	}[];
}

const menuItems: MenuItem[] = [{ name: "Photo to Cartoon", href: "/" }];

export const Header = () => {
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

	return (
		<header className="fixed top-0 z-20 w-full border-b border-transparent bg-white px-2 transition-colors duration-300">
			<div className="flex h-16 flex-wrap items-center justify-between px-4 md:px-6">
				<div className="-ml-4 flex flex-row items-center gap-8 md:-ml-0">
					<NoPrefetchLink href="/" className="flex items-center gap-2 rtl:space-x-reverse">
						<Logo />
						<span className="text-xl font-semibold">{WEBNAME}</span>
					</NoPrefetchLink>
					<div className="hidden rounded-lg font-normal md:flex md:flex-row">
						<NavigationMenu>
							<NavigationMenuList className="space-x-0">
								{menuItems.map((route, index) => (
									<React.Fragment key={index}>
										{route.items ? (
											<NavigationMenuItem>
												<NavigationMenuTrigger className="bg-transparent px-3 font-normal text-black/70 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
													{route.name}
												</NavigationMenuTrigger>
												<NavigationMenuContent>
													<div className="space-y-4 p-5">
														<p className="text-sm font-medium">{route.name}</p>
														<div className="flex w-[280px] flex-col gap-2">
															{route.items.map((feature, index) => (
																<NoPrefetchLink
																	key={index}
																	href={feature.href}
																	className="flex flex-row items-center gap-2 rounded-lg p-1 text-muted-foreground hover:bg-zinc-100"
																>
																	{feature.image && (
																		<img
																			src={feature.image}
																			alt={feature.name}
																			className="aspect-square h-16 rounded-lg object-cover"
																			loading="lazy"
																		/>
																	)}
																	<div className=" ">
																		<p className="text-sm font-medium text-black">{feature.name}</p>
																		{feature.description && (
																			<p className="text-xs text-muted-foreground">{feature.description}</p>
																		)}
																	</div>
																</NoPrefetchLink>
															))}
														</div>
													</div>
												</NavigationMenuContent>
											</NavigationMenuItem>
										) : (
											<NavigationMenuItem>
												<NavigationMenuLink
													className={cn("px-3 py-2 text-sm hover:bg-transparent hover:text-accent-foreground")}
													asChild
												>
													<NoPrefetchLink
														href={route.href!}
														className="flex flex-row items-center font-normal text-black/70"
														target={route.target}
													>
														{route.name}
														{route.icon && <>{route.icon}</>}
													</NoPrefetchLink>
												</NavigationMenuLink>
											</NavigationMenuItem>
										)}
									</React.Fragment>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				</div>

				<div className="flex flex-row items-center gap-3">
					<button className="-mr-4 flex md:hidden" onClick={() => setShowMobileMenu(true)}>
						<MenuIcon className="size-6 md:hidden" />
					</button>
				</div>
			</div>

			<Dialog open={showMobileMenu} onOpenChange={setShowMobileMenu}>
				<DialogContent className="h-[97vh] w-[95vw] max-w-full rounded">
					<DialogHeader>
						<DialogTitle className="text-start">
							<NoPrefetchLink href="/" className="flex items-center space-x-2">
								<Logo />
								<span className="text-lg font-semibold">{WEBNAME}</span>
							</NoPrefetchLink>
						</DialogTitle>
						<div className="h-full pt-3 text-start">
							{menuItems.map((route, index) => (
								<React.Fragment key={index}>
									{route.items ? (
										<div className="space-y-2">
											<Accordion type="single" collapsible>
												<AccordionItem value="item-1">
													<AccordionTrigger className="py-3 text-base font-normal text-black/80 hover:no-underline">
														{route.name}
													</AccordionTrigger>
													<AccordionContent className="space-y-2">
														{route.items.map((route, index) => (
															<div key={index} className="">
																<NoPrefetchLink
																	href={route.href}
																	className="text-black/70"
																	onClick={() => setShowMobileMenu(false)}
																>
																	<p className="items-center">{route.name}</p>
																</NoPrefetchLink>
															</div>
														))}
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										</div>
									) : (
										<div className="">
											<div className="py-3">
												<NoPrefetchLink
													href={route.href!}
													className="font-normal text-black/80"
													target={route.target}
													onClick={() => setShowMobileMenu(false)}
												>
													<p className="items-center">
														{route.name}
														{route.icon && <>{route.icon}</>}
													</p>
												</NoPrefetchLink>
											</div>
											<Separator className="" />
										</div>
									)}
								</React.Fragment>
							))}
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</header>
	);
};
