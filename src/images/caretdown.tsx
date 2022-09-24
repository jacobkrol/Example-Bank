import { MouseEventHandler } from "react";

export default function CaretDown({
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
      viewBox="0 0 16 16"
      height={`${size}px`}
      width={`${size}px`}
      xmlns="http://www.w3.org/2000/svg"
      xlinkTitle={alt}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"></path>
    </svg>
  );
}
