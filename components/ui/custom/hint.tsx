import type { PropsWithChildren } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HintProps {
	label: string;
	side?: "top" | "bottom" | "left" | "right";
	align?: "start" | "center" | "end";
	sideOffset?: number;
	alignOffset?: number;
	className?: string;
}

export const Hint = ({ label, children, align, side, alignOffset, sideOffset, className }: PropsWithChildren<HintProps>) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={100}>
				<TooltipTrigger aria-label={label} asChild>
					{children}
				</TooltipTrigger>

				<TooltipContent className={className} side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
					<p className="font-medium capitalize">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
