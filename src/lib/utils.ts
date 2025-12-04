import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 双重编码 URL 路径段，用于 GitHub Pages 兼容性
 * 先进行单次编码，然后将 % 编码为 %25，确保在 GitHub Pages 上可以正确访问
 * @param segment 要编码的路径段
 * @returns 双重编码后的路径段
 */
export function doubleEncodeURIComponent(segment: string): string {
  const encoded = encodeURIComponent(segment);
  // 将 % 编码为 %25，实现双重编码
  return encoded.replace(/%/g, '%25');
}

/**
 * 双重编码 URL 路径（支持多段路径）
 * @param path 要编码的路径，可以是单段或多段（用 / 分隔）
 * @returns 双重编码后的路径
 */
export function doubleEncodePath(path: string): string {
  return path.split('/').map(segment => doubleEncodeURIComponent(segment)).join('/');
}
