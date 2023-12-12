const fs = require('fs-extra');
const archiver = require('archiver');

const outputZipPath = './out/archive.zip'; // Specify the 'out' directory

async function zipFiles() {
  try {
    // Create the 'out' directory if it doesn't exist
    await fs.ensureDir('./out');

    // Create a new zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression level
    });

    // Create a write stream to save the archive
    const output = fs.createWriteStream(outputZipPath);

    // Pipe the archive data to the write stream
    archive.pipe(output);

    // Add the contents of the 'dist' directory to the archive
    archive.directory('./dist', false);

    // Add the 'node_modules' directory to the archive
    archive.directory('./node_modules', 'node_modules');

    // Finalize the archive
    await archive.finalize();

    console.log(`Files zipped successfully. Output path: ${outputZipPath}`);
  } catch (err) {
    console.error('Error zipping files:', err);
  }
}

zipFiles();
