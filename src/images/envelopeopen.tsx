import { MouseEventHandler } from "react";

export default function EnvelopeOpen({
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
      <path d="M19.5 22.5a3 3 0 003-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 01-.712 1.321l-5.683-3.06a1.5 1.5 0 00-1.422 0l-5.683 3.06a.75.75 0 01-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 003 3h15z"></path>
      <path d="M1.5 9.589v-.745a3 3 0 011.578-2.641l7.5-4.039a3 3 0 012.844 0l7.5 4.039A3 3 0 0122.5 8.844v.745l-8.426 4.926-.652-.35a3 3 0 00-2.844 0l-.652.35L1.5 9.59z"></path>
    </svg>
  );
}
