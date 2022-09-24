import { MouseEventHandler } from "react";

export default function Envelope({
  size = 25,
  alt,
  onClick
}: {
  size?: number;
  alt?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      aria-hidden="true"
      height={`${size}px`}
      width={`${size}px`}
      xmlns="http://www.w3.org/2000/svg"
      xlinkTitle={alt}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"></path>
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"></path>
    </svg>
  );
}
