"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
// Function to compute a hash for a file (used to find duplicates)
const computeFileHash = (filePath) => {
    const hash = crypto_1.default.createHash('sha256');
    const fileBuffer = fs_1.default.readFileSync(filePath);
    hash.update(fileBuffer);
    return hash.digest('hex');
};
// Function to find and delete duplicate files in a folder
const deleteDuplicateImages = (inputFolderPath) => {
    const fileHashes = new Map();
    // Read all files in the input folder
    const files = fs_1.default.readdirSync(inputFolderPath);
    files.forEach((file) => {
        const filePath = path_1.default.join(inputFolderPath, file);
        // Check if it's a file
        if (fs_1.default.statSync(filePath).isFile()) {
            // Compute the file hash
            const fileHash = computeFileHash(filePath);
            // Check if the hash already exists
            if (fileHashes.has(fileHash)) {
                const duplicateFiles = fileHashes.get(fileHash);
                duplicateFiles === null || duplicateFiles === void 0 ? void 0 : duplicateFiles.push(filePath);
            }
            else {
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
                fs_1.default.unlinkSync(duplicateFilePath);
            });
        }
    });
    console.log('Duplicate deletion process completed.');
};
// Example usage:
const inputFolderPath = './input'; // Path to your input folder
deleteDuplicateImages(inputFolderPath);
