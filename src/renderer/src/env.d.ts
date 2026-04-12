// Allow importing JSON files as modules in the renderer project
declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}
