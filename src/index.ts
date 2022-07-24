import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * The file's data, a string or NodeJS.ArrayBufferView
 * @typedef {(string|NodeJS.ArrayBufferView)} Data
 */
type Data = string | NodeJS.ArrayBufferView;

/**
 * Get the SHA256 hash of the data,
 * converted to hex format.
 *
 * @param {Data} data The file's data
 *
 * @returns {String} SHA256 file hash
 */
export function getFileHash(data: Data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Resolve the unique file name,
 * based on the file hash + extension.
 *
 * @param {String} extension File extension
 * @param {Data} data The file's data
 *
 * @returns {String} Resolved file name
 */
export function getFileName(extension: string, data: Data): string {
  const hash = getFileHash(data);
  const connector = extension.startsWith('.') ? '' : '.';
  return `${hash}${connector}${extension}`;
}

/**
 * Resolve the unique file path,
 * based on the file hash + extension.
 *
 * @param {Data} directory Path to the output directory
 * @param {String} extension File extension
 * @param {Data} data The file's data
 *
 * @returns {String} Resolved file path
 */
export function getFilePath(directory: string, extension: string, data: Data): string {
  const fileName = getFileName(extension, data);
  return path.resolve(directory, fileName);
}

/**
 * Write data to a unique file synchronously.
 * Calling multiple times with the exact same data,
 * will result in the same file name.
 *
 * @param {Data} directory Path to the output directory
 * @param {String} extension File extension
 * @param {Data} data The file's data
 * @param {fs.WriteFileOptions} options Encoding or WriteFileOptions
 *
 * @returns {String} File name of created file
 */
export function writeSync(directory: string, extension: string, data: Data, options?: fs.WriteFileOptions): string {
  const filePath = getFilePath(directory, extension, data);
  const fileName = path.basename(filePath);
  if (fs.existsSync(filePath)) return fileName;
  fs.writeFileSync(filePath, data, options);
  return fileName;
}

/**
 * Write data to a unique file asynchronously.
 * Calling multiple times with the exact same data,
 * will result in the same file name.
 *
 * @param {Data} directory Path to the output directory
 * @param {String} extension File extension
 * @param {Data} data The file's data
 * @param {fs.WriteFileOptions} options Encoding or WriteFileOptions
 *
 * @returns {Promise<String>} File name of created file
 */
export function write(
  directory: string,
  extension: string,
  data: Data,
  options: fs.WriteFileOptions = {},
): Promise<string> {
  return new Promise<string>((res, rej) => {
    const filePath = getFilePath(directory, extension, data);
    const fileName = path.basename(filePath);
    fs.stat(filePath, (err) => {
      if (!err) return res(fileName);
      fs.writeFile(filePath, data, options, (err) => {
        if (err) return rej(err);
        res(fileName);
      });
    });
  });
}

export default {
  write,
  writeSync,
  getFilePath,
  getFileHash,
};
