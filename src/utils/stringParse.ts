export function getAfterLastCharacter({string, character} : {string: string, character: string}) {
    const lastIndex = string.lastIndexOf(character)
    const lastEndpoint = string.substring(lastIndex)
    const lastEndpointFormat = lastEndpoint.split(character).join('')
    return lastEndpointFormat
}