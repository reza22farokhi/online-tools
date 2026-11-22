export interface GenerateOptions { rootName?: string; optionalProperties?: boolean; useTypeAliases?: boolean; }
const RESERVED = new Set(["any","boolean","constructor","number","string","symbol","this","void","never","unknown","null","true","false","interface","type","class","function","return","default","export","import","extends","implements","new","delete","typeof","instanceof","in","of","as","async","await","break","case","catch","continue","debugger","do","else","finally","for","if","switch","throw","try","var","let","const","while","with","yield"]);
function identifier(value: string): string {
  const clean = value.replace(/[^\p{L}\p{N}_$]/gu, "_");
  const safe = /^[\p{L}_$]/u.test(clean) ? clean : "_" + clean;
  return RESERVED.has(safe) ? safe + "_" : safe || "Property";
}
function typeName(value: string): string {
  return identifier(value).replace(/(^|_)([\p{L}\p{N}])/gu, (_match, _prefix, char: string) => char.toUpperCase()) || "Generated";
}
function quote(value: string): string { return JSON.stringify(value); }
export function generateTypeScript(source: string, options: GenerateOptions = {}): string {
  if (source.length > 100_000) throw new Error("Input exceeds 100,000 characters.");
  let value: unknown;
  try { value = JSON.parse(source); }
  catch (error) { throw new Error(error instanceof Error ? error.message : "Invalid JSON."); }
  const declarations: string[] = [];
  const seen = new Map<string, string>();
  const root = typeName(options.rootName?.trim() || "Root");
  function visit(item: unknown, name: string): string {
    if (item === null) return "null";
    if (Array.isArray(item)) {
      if (!item.length) return "unknown[]";
      const members = [...new Set(item.map((entry, index) => visit(entry, name + "Item" + (index + 1))))];
      return (members.length > 1 ? "(" + members.join(" | ") + ")" : members[0]) + "[]";
    }
    if (typeof item === "object") {
      const object = item as Record<string, unknown>;
      const signature = JSON.stringify(object);
      const cached = seen.get(signature);
      if (cached) return cached;
      const currentName = typeName(name);
      seen.set(signature, currentName);
      const properties = Object.entries(object).map(([key, value]) => {
        const property = /^[A-Za-z_$][\w$]*$/.test(key) && !RESERVED.has(key) ? key : quote(key);
        return "  " + property + (options.optionalProperties ? "?" : "") + ": " + visit(value, currentName + typeName(key)) + ";";
      });
      declarations.push(options.useTypeAliases
        ? "export type " + currentName + " = {\n" + properties.join("\n") + "\n};"
        : "export interface " + currentName + " {\n" + properties.join("\n") + "\n}");
      return currentName;
    }
    if (typeof item === "string") return "string";
    if (typeof item === "number") return "number";
    if (typeof item === "boolean") return "boolean";
    return "unknown";
  }
  const rootType = visit(value, root);
  return declarations.length ? declarations.join("\n\n") : "export type " + root + " = " + rootType + ";";
}
