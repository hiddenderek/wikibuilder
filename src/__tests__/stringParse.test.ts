import { getAfterLastCharacter } from "../utils/stringParse";

test('get last of string', () => {
    expect(getAfterLastCharacter({string: '/wiki/bobbo', character: '/'})).toBe('bobbo')
}) 