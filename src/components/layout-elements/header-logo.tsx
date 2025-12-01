import Image from "next/image";

export function HeaderLogo() {
        return (
                <div className="flex items-center">
                    <Image
                        src="/resources/images/logos/epresence-logo-1-mobile-white.png"
                        alt="epresence"
                        width={96}
                        height={32}
                        className="object-contain h-8"
                    />
                    <span className="font-bold tracking-tight text-white">GateKeeper</span>
                </div>
        )
}