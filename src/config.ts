let port = {
    port: typeof process != "undefined" ? (process?.env?.PORT || 8030) : 8030,
    authPort: typeof process != "undefined" ? (process?.env?.PORT || 8020) : 8020,
    hostname: "localhost"
}
export default port

