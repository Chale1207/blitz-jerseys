'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import useMeasure from 'react-use-measure';
import type { ReactNode, CSSProperties } from 'react';

type InfiniteSliderProps = {
  children: ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [hovering, setHovering] = useState(false);
  const [ref, { width, height }] = useMeasure();
  const activeDuration = hovering && durationOnHover ? durationOnHover : duration;
  const isH = direction === 'horizontal';

  // Travel distance = one copy's measured size + the gap that sits between the
  // two copies in the outer flex container. At the end of that distance the
  // second copy occupies exactly where the first started → seamless loop.
  const contentSize = (isH ? width : height) + gap;

  const trackStyle: CSSProperties =
    contentSize > gap
      ? ({
          '--slider-dist': `${-contentSize}px`,
          animationName: isH ? 'infinite-slider-h' : 'infinite-slider-v',
          animationDuration: `${activeDuration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: reverse ? 'reverse' : 'normal',
        } as CSSProperties)
      : {};

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className={cn('flex w-max', !isH && 'flex-col')}
        style={{ gap: `${gap}px`, ...trackStyle }}
        onMouseEnter={() => durationOnHover && setHovering(true)}
        onMouseLeave={() => durationOnHover && setHovering(false)}
      >
        {/* First copy — measured to get the exact pixel distance to loop */}
        <div
          ref={ref}
          className={cn('flex shrink-0', !isH && 'flex-col')}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
        {/* Duplicate copy — aria-hidden so screen readers skip it */}
        <div
          className={cn('flex shrink-0', !isH && 'flex-col')}
          aria-hidden
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
