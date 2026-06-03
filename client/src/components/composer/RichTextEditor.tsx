"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  limit?: number
}

const RichTextEditor = ({ content, onChange, placeholder = 'Write your post here...', limit }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      CharacterCount.configure({
        limit: limit,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] p-4 font-base',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="w-full border-2 border-border rounded-base bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b-2 border-border bg-main/10">
        <Button
          variant="noShadow"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-main' : ''}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant="noShadow"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-main' : ''}
        >
          <Italic size={16} />
        </Button>
        <div className="w-[1px] h-6 bg-border mx-1" />
        <Button
          variant="noShadow"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-main' : ''}
        >
          <List size={16} />
        </Button>
        <Button
          variant="noShadow"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-main' : ''}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          variant="noShadow"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-main' : ''}
        >
          <Quote size={16} />
        </Button>
        <div className="flex-1" />
        <Button
          variant="noShadow"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={16} />
        </Button>
        <Button
          variant="noShadow"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={16} />
        </Button>
      </div>

      {/* Editor Surface */}
      <EditorContent editor={editor} />

      {/* Footer / Stats */}
      <div className="px-4 py-2 border-t-2 border-border bg-secondary-background/50 flex justify-end">
        <span className="text-xs font-bold uppercase tracking-wider">
          {editor.storage.characterCount.characters()} / {limit || '∞'} characters
        </span>
      </div>
    </div>
  )
}

export default RichTextEditor
