// Type declarations to fix React 19 compatibility with @react-pdf/renderer
// This is a temporary fix until @react-pdf/renderer is updated for React 19

declare module '@react-pdf/renderer' {
  import * as React from 'react';

  export interface DocumentProps {
    children?: React.ReactNode;
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
  }

  export interface PageProps {
    size?: string | { width: number; height: number };
    orientation?: 'portrait' | 'landscape';
    style?: any;
    wrap?: boolean;
    children?: React.ReactNode;
  }

  export interface ViewProps {
    style?: any;
    wrap?: boolean;
    children?: React.ReactNode;
    fixed?: boolean;
  }

  export interface TextProps {
    style?: any;
    wrap?: boolean;
    children?: React.ReactNode;
    fixed?: boolean;
  }

  export const Document: React.FC<DocumentProps>;
  export const Page: React.FC<PageProps>;
  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;

  export interface Style {
    [key: string]: any;
  }

  export interface Styles {
    [key: string]: Style;
  }

  export const StyleSheet: {
    create: <T extends Styles>(styles: T) => T;
  };

  export const Font: {
    register: (options: any) => void;
    registerHyphenationCallback: (callback: any) => void;
    registerEmojiSource: (options: any) => void;
  };

  export const pdf: (document: React.ReactElement) => {
    toBlob: () => Promise<Blob>;
    toBuffer: () => Promise<Buffer>;
    toString: () => Promise<string>;
  };
}
