export type XmlMode = 'format' | 'minify' | 'validate';
export interface XmlResult { ok: boolean; output: string; error?: string; }

const MAX_XML_LENGTH = 100_000;
export const MAX_XML_NODES = 20_000;
export const MAX_XML_DEPTH = 256;

function enforceTreeLimits(doc: XMLDocument): void {
  const stack: Array<{ node: Node; depth: number }> = [{ node: doc.documentElement, depth: 1 }];
  let nodeCount = 0;

  while (stack.length > 0) {
    const current = stack.pop()!;
    nodeCount += 1;
    if (nodeCount > MAX_XML_NODES) {
      throw new Error(`XML document exceeds the ${MAX_XML_NODES.toLocaleString()} node limit.`);
    }
    if (current.depth > MAX_XML_DEPTH) {
      throw new Error(`XML nesting exceeds the maximum depth of ${MAX_XML_DEPTH}.`);
    }

    for (let i = current.node.childNodes.length - 1; i >= 0; i -= 1) {
      stack.push({ node: current.node.childNodes[i], depth: current.depth + 1 });
    }
  }
}

function parseXml(input: string): XMLDocument {
  if (!input.trim()) throw new Error('XML input is empty.');
  if (input.length > MAX_XML_LENGTH) throw new Error('XML input exceeds 100,000 characters.');
  if (/<!DOCTYPE/i.test(input)) throw new Error('DOCTYPE declarations are not supported for safety.');
  const doc = new DOMParser().parseFromString(input, 'application/xml');
  const parserError = doc.getElementsByTagName('parsererror')[0];
  if (parserError) throw new Error(parserError.textContent?.trim() || 'Invalid XML syntax.');
  if (!doc.documentElement) throw new Error('XML document has no root element.');
  enforceTreeLimits(doc);
  return doc;
}

function serializeNode(node: Node, depth: number, pretty: boolean): string {
  const serializer = new XMLSerializer();
  if (node.nodeType !== Node.ELEMENT_NODE) return serializer.serializeToString(node);
  const element = node as Element;
  const opening = serializer.serializeToString(element.cloneNode(false));
  const children = Array.from(element.childNodes);
  if (!children.length) return opening;
  const hasSignificantText = children.some(child =>
    child.nodeType === Node.TEXT_NODE && Boolean(child.textContent?.trim())
  );
  if (hasSignificantText) {
    return opening.replace(/\/>$/, '>') +
      children.map(child => serializeNode(child, depth + 1, false)).join('') +
      `</${element.tagName}>`;
  }
  const content = children
    .filter(child => !(child.nodeType === Node.TEXT_NODE && !child.textContent?.trim()))
    .map(child => serializeNode(child, depth + 1, pretty))
    .join(pretty ? '\n' : '');
  if (!content) return opening;
  if (!pretty) return opening.replace(/\/>$/, '>') + content + `</${element.tagName}>`;
  const pad = '  '.repeat(depth + 1);
  const closePad = '  '.repeat(depth);
  return opening.replace(/\/>$/, '>') + '\n' + pad +
    content.replace(/\n/g, '\n' + pad) + '\n' + closePad +
    `</${element.tagName}>`;
}

export function processXml(input: string, mode: XmlMode, indent: 2 | 4 = 2): XmlResult {
  try {
    const doc = parseXml(input);
    if (mode === 'validate') return { ok: true, output: 'XML is valid.' };
    const serializer = new XMLSerializer();
    if (mode === 'minify') return { ok: true, output: serializer.serializeToString(doc) };
    const formatted = serializeNode(doc.documentElement, 0, true);
    const output = indent === 4 ? formatted.replace(/^(?:  )+/gm, spaces => spaces + spaces) : formatted;
    return { ok: true, output: `<?xml version="1.0"?>\n${output}` };
  } catch (error) {
    return { ok: false, output: '', error: error instanceof Error ? error.message : 'Unable to process XML.' };
  }
}
