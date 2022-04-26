let port = {
    port: typeof process != "undefined" ? (process?.env?.PORT || 8050) : 8050,
    authPort: typeof process != "undefined" ? (process?.env?.PORT || 8040) : 8040,
    hostname: "localhost"
}
export default port

