import type { ColorType } from "../types";

export const getSize = (isSmall: boolean) => (isSmall ? 8 : 10);
export const invertColor = (color: ColorType) => (color === "black" ? "white" : "black");
