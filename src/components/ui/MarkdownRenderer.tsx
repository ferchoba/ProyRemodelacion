import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { defaultSchema } from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Custom sanitization schema that allows more HTML elements
const customSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': ['className', 'id'],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'div',
    'span',
    'section',
    'article',
    'header',
    'footer',
    'nav',
    'aside',
    'main',
  ],
};

export default async function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  try {
    const processedContent = await remark()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, customSchema)
      .use(rehypeStringify)
      .process(content);

    return (
      <div 
        className={`prose prose-invert prose-lg max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: String(processedContent) }}
      />
    );
  } catch (error) {
    console.error('Error processing markdown:', error);
    return (
      <div className={`text-red-400 ${className}`}>
        Error al procesar el contenido
      </div>
    );
  }
}
