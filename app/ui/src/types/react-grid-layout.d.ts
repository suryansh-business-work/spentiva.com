/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-grid-layout' {
  import * as React from 'react';

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    moved?: boolean;
  }

  export interface Layouts {
    [P: string]: Layout[];
  }

  export interface ResponsiveGridLayoutProps {
    width: number;
    layouts?: Layouts;
    breakpoints?: { [P: string]: number };
    cols?: { [P: string]: number };
    rowHeight?: number;
    maxRows?: number;
    isDraggable?: boolean;
    isResizable?: boolean;
    onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
    onBreakpointChange?: (breakpoint: string, cols: number) => void;
    onWidthChange?: (width: number, margin: [number, number], cols: number, containerPadding: [number, number] | null) => void;
    draggableHandle?: string;
    draggableCancel?: string;
    containerPadding?: [number, number] | null;
    margin?: [number, number];
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    autoSize?: boolean;
    useCSSTransforms?: boolean;
  }

  export function ResponsiveGridLayout(props: ResponsiveGridLayoutProps): React.ReactElement;
  export { ResponsiveGridLayout as Responsive };

  export function useContainerWidth(options?: {
    measureBeforeMount?: boolean;
    initialWidth?: number;
  }): {
    width: number;
    mounted: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
    measureWidth: () => void;
  };

  export function useResponsiveLayout(options: {
    width: number;
    breakpoints?: { [P: string]: number };
    cols?: { [P: string]: number };
    layouts?: Layouts;
    onBreakpointChange?: (breakpoint: string, cols: number) => void;
    onLayoutChange?: (layout: Layout[], layouts: Layouts) => void;
    onWidthChange?: (width: number, margin: [number, number], cols: number, containerPadding: [number, number] | null) => void;
  }): {
    layout: Layout[];
    layouts: Layouts;
    breakpoint: string;
    cols: number;
    setLayoutForBreakpoint: (bp: string, layout: Layout[]) => void;
    setLayouts: (layouts: Layouts) => void;
    sortedBreakpoints: string[];
  };

  export function useGridLayout(options: any): any;

  export const DEFAULT_BREAKPOINTS: { [P: string]: number };
  export const DEFAULT_COLS: { [P: string]: number };

  export function GridLayout(props: any): React.ReactElement;
  export { GridLayout as ReactGridLayout };
  export default GridLayout;
}

declare module 'react-grid-layout/css/styles.css' {
  const content: string;
  export default content;
}

declare module 'react-resizable/css/styles.css' {
  const content: string;
  export default content;
}
