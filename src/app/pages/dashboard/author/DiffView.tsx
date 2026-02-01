import React, { useEffect, useRef } from 'react';
import { cn } from '../../../components/ui/utils';

interface DiffViewProps {
  original: string;
  current: string;
  className?: string;
}

export const DiffView: React.FC<DiffViewProps> = ({
  original,
  current,
  className,
}) => {
  const leftRef = useRef<HTMLTextAreaElement>(null);
  const rightRef = useRef<HTMLTextAreaElement>(null);
  const isScrolling = useRef<'left' | 'right' | null>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;

    if (!left || !right) return;

    const handleLeftScroll = () => {
      if (isScrolling.current === 'right') return;
      isScrolling.current = 'left';
      right.scrollTop = left.scrollTop;
      // Reset after a small delay to allow other side to scroll
      setTimeout(() => {
        isScrolling.current = null;
      }, 50);
    };

    const handleRightScroll = () => {
      if (isScrolling.current === 'left') return;
      isScrolling.current = 'right';
      left.scrollTop = right.scrollTop;
      setTimeout(() => {
        isScrolling.current = null;
      }, 50);
    };

    left.addEventListener('scroll', handleLeftScroll);
    right.addEventListener('scroll', handleRightScroll);

    return () => {
      left.removeEventListener('scroll', handleLeftScroll);
      right.removeEventListener('scroll', handleRightScroll);
    };
  }, []);

  return (
    <div className={cn('flex gap-0 border rounded-md overflow-hidden h-64', className)}>
      <div className="flex-1 flex flex-col border-r bg-red-50/30">
        <div className="px-3 py-1 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
          Original (기존)
        </div>
        <textarea
          ref={leftRef}
          className="flex-1 w-full p-3 resize-none bg-transparent border-0 focus:ring-0 text-sm font-mono leading-relaxed"
          value={original}
          readOnly
        />
      </div>
      <div className="flex-1 flex flex-col bg-green-50/30">
        <div className="px-3 py-1 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
          Updated (변경)
        </div>
        <textarea
          ref={rightRef}
          className="flex-1 w-full p-3 resize-none bg-transparent border-0 focus:ring-0 text-sm font-mono leading-relaxed"
          value={current}
          readOnly
        />
      </div>
    </div>
  );
};
