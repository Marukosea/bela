const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../uploads');

function searchFiles(searchTerm) {
    const results = [];
    try {
        // Validasi apakah folder uploads ada
        if (!fs.existsSync(uploadsDir)) {
            console.error(`Uploads directory not found: ${uploadsDir}`);
            throw new Error(`Uploads directory does not exist.`);
        }

        // Baca isi folder uploads
        const files = fs.readdirSync(uploadsDir);

        // Tangani jika folder kosong
        if (files.length === 0) {
            console.warn(`Uploads directory is empty: ${uploadsDir}`);
            return results; // Kembalikan array kosong
        }

        // Cari file yang sesuai dengan searchTerm
        files.forEach(file => {
            if (file.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                    name: file,
                    path: path.join(uploadsDir, file),
                    type: path.extname(file).slice(1) // Dapatkan ekstensi file
                });
            }
        });
    } catch (error) {
        console.error(`Error reading files: ${error.message}`);
        throw error;
    }

    return results;
}

module.exports = {
    searchFiles
};