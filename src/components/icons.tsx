import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            width="1em"
            height="1em"
            {...props}
        >
            <rect width="256" height="256" fill="none" />
            <path
                d="M141.3,168.28,164,204h30L155.57,128,194,52H164l-22.7,35.72L124,52H94l38.43,76L94,204h30Z"
                fill="currentColor"
            />
            <path
                d="M62,204V52H32V204Z"
                fill="currentColor"
            />
        </svg>
    )
}
