export function idGen () {
    const middleVal = Math.round(Number(Math.random().toFixed(12)) * 1000000000000);
    const charArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const val1 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val2 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val3 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val4 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val5 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val6 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val7 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val8 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val9 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val10 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val11 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const val12 = charArray[Math.round((Number(Math.random().toFixed(2)) * 100))];
    const newId = `@${val1}${val2}${val3}${val4}${val5}${val6}-${middleVal}-${val7}${val8}${val9}${val10}${val11}${val12}`;
    return newId;
};

