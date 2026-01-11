/**
 * Converts a string to Title Case (capitalizes the first letter of each word).
 * @param {string} text - The text to convert.
 * @returns {string} The converted text.
 */
export const toTitleCase = (text) => {
    if (!text) return text
    return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

/**
 * Converts a string to Sentence case (capitalizes the first letter of the string).
 * @param {string} text - The text to convert.
 * @returns {string} The converted text.
 */
export const toSentenceCase = (text) => {
    if (!text) return text
    // Capitalize first char of string, and any char following [.!?] AND comma [,]
    return text.replace(
        /(^\s*\w|[\.\!\?\,]\s*\w|\n\s*\w)/g,
        (txt) => txt.toUpperCase()
    )
}
