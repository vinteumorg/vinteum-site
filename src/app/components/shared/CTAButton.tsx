import Link from "next/link";

interface CTAButtonProps {
    children: React.ReactNode;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    "aria-label"?: string;
}

export function CTAButton({
    children,
    href,
    target,
    rel,
    onClick,
    type = "button",
    disabled,
    className = "",
    "aria-label": ariaLabel,
}: CTAButtonProps) {
    const inner = (
        <span className="flex items-center gap-3 pl-6 pr-2 py-2">
            <span className="font-poppins text-base font-medium text-[#172719] whitespace-nowrap">
                {children}
            </span>
            {/* Icon container */}
            <span className="w-9 h-9 rounded-lg bg-[#59D279] flex items-center justify-center shrink-0">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#172719"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
            </span>
        </span>
    );

    const base = `inline-flex items-center rounded-[10px] bg-[#91FFAE] hover:bg-primary-hover transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

    if (href) {
        return (
            <Link href={href} target={target} rel={rel} className={base} aria-label={ariaLabel}>
                {inner}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={base} aria-label={ariaLabel}>
            {inner}
        </button>
    );
}
