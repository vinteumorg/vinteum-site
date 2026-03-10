interface BadgeProps {
    children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
    return (
        <span className="inline-flex items-center w-fit px-5 py-1.5 rounded-full border border-primary bg-badge-bg text-primary font-poppins text-sm">
            {children}
        </span>
    );
}
