let port = {
    port: typeof process != "undefined" ? (process?.env?.PORT || 8030) : 8030,
    authPort: typeof process != "undefined" ? (process?.env?.PORT || 8020) : 8020,
    hostname: "192.168.1.9"
}
export default port

