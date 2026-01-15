declare module 'dom-to-image' {
  interface Options {
    quality?: number;
    width?: number;
    height?: number;
    bgcolor?: string;
    style?: Partial<CSSStyleDeclaration>;
    filter?: (node: Node) => boolean;
    imagePlaceholder?: string;
    cacheBust?: boolean;
  }

  export function toPng(node: Node, options?: Options): Promise<string>;
  export function toJpeg(node: Node, options?: Options): Promise<string>;
  export function toSvg(node: Node, options?: Options): Promise<string>;
  export function toPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>;
  export function toCanvas(node: Node, options?: Options): Promise<HTMLCanvasElement>;
  export function toBlob(node: Node, options?: Options): Promise<Blob>;
}