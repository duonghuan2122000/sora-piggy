// Allow importing JSON files as modules in the renderer project
declare module '*.json' {
  const value: Record<string, any>;
  export default value;
}
