import Image from "next/image";

type HeroBackgroundProps = {
    primaryImage?: string;
    secondaryImage?: string;
    showGlow?: boolean;
};

export function HeroBackground({
    primaryImage,
    secondaryImage,
    showGlow = true,
}: HeroBackgroundProps) {
    return (
        <>
            {/* Primary background */}
            {primaryImage && (
                <Image
                    src={primaryImage}
                    alt=""
                    fill
                    priority
                    className="object-cover object-center select-none pointer-events-none"
                    aria-hidden="true"
                />
            )}

            {/* Secondary background — bottom-center, full-width decorative layer */}
            {secondaryImage && (
                <div className="absolute inset-x-0 bottom-0 w-full pointer-events-none select-none">
                    <Image
                        src={secondaryImage}
                        alt=""
                        width={1920}
                        height={600}
                        className="w-full h-auto object-cover object-bottom"
                        aria-hidden="true"
                    />
                </div>
            )}

            {/* Glow effect */}
            {showGlow && (
                <div
                    className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[300px] h-[100px] rounded-[50%] bg-[#FFAE00]/60 blur-[60px] pointer-events-none select-none"
                    aria-hidden="true"
                />
            )}
        </>
    );
}
