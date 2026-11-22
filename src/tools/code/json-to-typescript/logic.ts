export interface GenerateOptions {
  rootName?: string;
  optionalProperties?: boolean;
  useTypeAliases?: boolean;
}
const RESERVED = new Set(["any","boolean","constructor","number","string","symbol","this","void","never","unknown","null","true","false","interface","type","class","function","return","default","export","import","extends","implements","new","delete","typeof","instanceof","in","of","as","async","await","break","case","catch","continue","debugger","do","else","finally","for","if","switch","throw","try","var","let","const","while","with","yield"]);
function identifier(value: string): string {
  const clean = value.replace(/[^\p{L}\p{N}_$]/gu, "_");
  const safe = /^[\p{L}_$]/u.test(clean) ? clean : "_" + clean;
  return RESERVED.has(safe) ? safe + "_" : safe || "Property";
}
function typeName(value: string): string {
  return identifier(value).replace(/(^|_)([\p{L}\p{N}])/gu, (_, p, c: string) => c.toUpperCase()) || "Generated";
}
function quote(value: string): string { return JSON.stringify(value); }
export function generateTypeScript(source: string, options: GenerateOptions = {}): string {
  if (source.length > 100_000) throw new Error("Input exceeds 100,000 characters.");
  let value: unknown;
  try { value = JSON.parse(source); } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Invalid JSON.");
  }
  const declarations: string[] = [];
  const root = typeName(options.rootName?.trim() || "Root");
  const seen = new Map<string, string>();
  function infer(item: unknown, name: string): string {
    if (item === null) return "null";
    if (Array.isArray(item)) {
      if (!item.length) return "unknown[]";
      const members = [...new Set(item.map((entry, i) => infer(entry, name + "Item" + (i + 1))))];
      const union = members.length === 1 ? members[0] : "(" + members.join(" | ") + ")";
      return union + "[]";
    }
    if (typeof item === "string") return "string";
    if (typeof item === "number") return Number.isInteger(item) ? "number" : "number";
    if (typeof item === "boolean") return "boolean";
    if (typeof item === "object') return "unknown";
    return "unknown";
  }
  function objectType(obj: Record<string, unknown>, name: string): string {
    const signature = JSON.stringify(obj);
    const existing = seen.get(signature);
    if (existing) return existing;
    const interfaceName = typeName(name);
    seen.set(signature, interfaceName);
    const lines = Object.entries(obj).map(([key, val]) => {
      const keyName = /^[A-Za-z_$][\w$]*$/.test(key) && !RESERVED.has(key) ? key : quote(key);
      const optional = options.optionalProperties ? "?" : "";
      return "  " + keyName + optional + ": " + infer(val, interfaceName + typeName(key)) + ";";
    });
    declarations.push((options.useTypeAliases ? "export type " + interfaceName + " = {\n" + lines.join("\n") + "\n};" : "export interface " + interfaceName + " {\n" + lines.join("\n") + "\n}"));
    return interfaceName;
  }
  function visit(item: unknown, name: string): string {
    if (item === null) return "null";
    if (Array.isArray(item)) {
      if (!item.length) return "unknown[]";
      const members = [...new Set(item.map((entry, i) => visit(entry, name + "Item" + (i + 1))))];
      return (members.length > 1 ? "(" + members.join(" | ") + ")" : members[0]) + "[]";
    }
    if (typeof item === "object") return objectType(item as Record<string, unknown>, name);
    if (typeof item === "string") return "string";
    if (typeof item === "number") return "number";
    if (typeof item === "boolean") return "boolean";
    return "unknown";
  }
  const rootType = visit(value, root);
  return [declarations.join("\n\n"), declarations.length ? "" : "export type " + root + " = " + rootType + ";"].filter(Boolean).join("\n");
}
