import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Function to compute a hash for a file (used to find duplicates)
const computeFileHash = (filePath: string): string => {
  const hash = crypto.createHash('sha256');
  const fileBuffer = fs.readFileSync(filePath);
  hash.update(fileBuffer);
  return hash.digest('hex');
};

// Function to find and delete duplicate files in a folder
const deleteDuplicateImages = (inputFolderPath: string): void => {
  const fileHashes: Map<string, string[]> = new Map();

  // Read all files in the input folder
  const files = fs.readdirSync(inputFolderPath);

  files.forEach((file) => {
    const filePath = path.join(inputFolderPath, file);

    // Check if it's a file
    if (fs.statSync(filePath).isFile()) {
      // Compute the file hash
      const fileHash = computeFileHash(filePath);

      // Check if the hash already exists
      if (fileHashes.has(fileHash)) {
        const duplicateFiles = fileHashes.get(fileHash);
        duplicateFiles?.push(filePath);
      } else {
        fileHashes.set(fileHash, [filePath]);
      }
    }
  });

  // Delete duplicates (keep the first instance, delete others)
  fileHashes.forEach((filePaths) => {
    if (filePaths.length > 1) {
      console.log(`Found duplicates for: ${filePaths[0]}`);
      filePaths.slice(1).forEach((duplicateFilePath) => {
        console.log(`Deleting duplicate: ${duplicateFilePath}`);
        fs.unlinkSync(duplicateFilePath);
      });
    }
  });

  console.log('Duplicate deletion process completed.');
};

// Example usage:
const inputFolderPath = './input'; // Path to your input folder
deleteDuplicateImages(inputFolderPath);
