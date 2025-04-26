import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export function SubmitButton({
	children,
	isSubmitting,
	...props
}: {
	children: React.ReactNode;
	isSubmitting: boolean;
} & ButtonProps) {
	return (
		<Button disabled={isSubmitting} {...props}>
			{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
		</Button>
	);
}
