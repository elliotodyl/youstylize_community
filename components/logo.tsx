import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
	return <img className={cn("size-8 w-8", className)} src="/favicon.ico" alt="YouStylize" />;
};
