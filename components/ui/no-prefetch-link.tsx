import Link, { LinkProps } from "next/link";

type NoPrefetchLinkProps = LinkProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		children?: React.ReactNode;
	};

export function NoPrefetchLink({ children, href, ...props }: NoPrefetchLinkProps) {
	return (
		<Link href={href} prefetch={false} {...props}>
			{children}
		</Link>
	);
}
