declare module "@tiptap/react" {
  import * as React from "react";

  export interface EditorChain {
    focus(): EditorChain;
    toggleBold(): EditorChain;
    toggleItalic(): EditorChain;
    toggleBulletList(): EditorChain;
    toggleOrderedList(): EditorChain;
    run(): boolean;
  }

  export interface Editor {
    getHTML(): string;
    chain(): EditorChain;
    isActive(name: string): boolean;
  }

  export interface UseEditorOptions {
    extensions?: unknown[];
    content?: string;
    immediatelyRender?: boolean;
    editorProps?: {
      attributes?: Record<string, string>;
    };
    onUpdate?: (props: { editor: Editor }) => void;
  }

  export function useEditor(options: UseEditorOptions): Editor | null;

  export const EditorContent: React.ComponentType<{
    editor: Editor | null;
  }>;
}

declare module "@tiptap/starter-kit" {
  const StarterKit: unknown;
  export default StarterKit;
}

declare module "@tiptap/extension-placeholder" {
  const Placeholder: {
    configure: (options: { placeholder: string }) => unknown;
  };
  export default Placeholder;
}