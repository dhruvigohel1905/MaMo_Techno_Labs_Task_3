const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Clean extracted text by removing formatting glitches, collapsing extra whitespace,
 * and cleaning empty lines.
 * @param {string} text
 * @returns {string}
 */
const cleanText = (text) => {
  if (!text) return '';

  return text
    // Replace carriage returns with standard newlines
    .replace(/\r\n/g, '\n')
    // Remove null bytes and strange unprintable characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Collapse multiple consecutive horizontal spaces into a single space
    .replace(/[ \t]+/g, ' ')
    // Collapse 3 or more consecutive newlines into exactly two newlines (keeps paragraph separation clean)
    .replace(/\n{3,}/g, '\n\n')
    // Trim surrounding whitespace
    .trim();
};

/**
 * Core text extraction helper
 * @param {Buffer} buffer File buffer
 * @param {string} mimeType File mime type
 * @returns {Promise<string>} Cleaned extracted text
 */
const extractText = async (buffer, mimeType) => {
  let rawText = '';

  if (mimeType === 'application/pdf') {
    // Extract PDF text
    const data = await pdfParse(buffer);
    rawText = data.text;
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // Extract DOCX text
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value;
  } else if (mimeType === 'text/plain') {
    // Extract TXT text
    rawText = buffer.toString('utf8');
  } else {
    throw new Error('Unsupported file type for text extraction.');
  }

  return cleanText(rawText);
};

module.exports = { extractText, cleanText };
