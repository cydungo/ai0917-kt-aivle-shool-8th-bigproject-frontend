import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (ref.current && chart) {
        try {
          const { svg } = await mermaid.render(uniqueId.current, chart);
          ref.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid render error:', error);
          ref.current.innerHTML = '<div class="text-red-500 text-sm">Syntax Error</div>';
        }
      }
    };

    renderChart();
  }, [chart]);

  return <div ref={ref} className="mermaid w-full flex justify-center" />;
}
