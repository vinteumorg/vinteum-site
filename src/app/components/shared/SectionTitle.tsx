interface SectionTitleProps {
    children: React.ReactNode;
    size?: "default" | "large" | "hero";
    className?: string;
}

const sizeClasses: Record<NonNullable<SectionTitleProps["size"]>, string> = {
    default: "text-5xl lg:text-[3.5rem]",
    large: "text-5xl sm:text-6xl lg:text-[4rem]",
    hero: "text-6xl sm:text-7xl lg:text-[5rem]",
};

export function SectionTitle({ children, size = "default", className = "" }: SectionTitleProps) {
    return (
        <h2
            className={`font-rethink-sans ${sizeClasses[size]} font-normal text-foreground leading-[1.05] tracking-tight ${className}`}
        >
            {children}
        </h2>
    );
}
