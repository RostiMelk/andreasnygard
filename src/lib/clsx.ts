import _clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const clsx = (...classes: ClassValue[]) => twMerge(_clsx(...classes));
export default clsx;
