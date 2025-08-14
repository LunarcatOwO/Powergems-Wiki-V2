import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import React from 'react';

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  'data-smooth'?: boolean | string;
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // By default, render <img> with pixelated scaling to avoid anti-aliasing
    img: (props: ImgProps) => {
      const { className, alt, ...rest } = props;
      // Allow opt-out by setting data-smooth
      const smooth = props['data-smooth'];
      const cls = [className, smooth ? undefined : 'pixelated']
        .filter(Boolean)
        .join(' ');
      // eslint-disable-next-line @next/next/no-img-element
      return <img className={cls} alt={typeof alt === 'string' ? alt : ''} {...rest} />;
    },
    ...components,
  };
}
