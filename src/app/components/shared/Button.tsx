import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    "aria-label"?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-btn-primary-text hover:bg-primary-hover",
    secondary: "bg-btn-secondary-bg text-white hover:opacity-90",
};

export function Button({
    children,
    variant = "primary",
    href,
    target,
    rel,
    onClick,
    type = "button",
    disabled,
    className = "",
    "aria-label": ariaLabel,
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-space-mono text-sm font-normal transition-all duration-200 cursor-pointer select-none";

    const styles = `${base} ${variantStyles[variant]} ${className}`;

    if (href) {
        return (
            <Link
                href={href}
                target={target}
                rel={rel}
                className={styles}
                aria-label={ariaLabel}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={styles}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
}
