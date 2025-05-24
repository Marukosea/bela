document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const pageSize = 10; // Jumlah item per halaman

    function fetchResults(page) {
        const query = document.getElementById('searchInput').value;

        fetch(`/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                const resultsContainer = document.getElementById('results');
                resultsContainer.innerHTML = '';
                if (data.items.length === 0) {
                    resultsContainer.innerHTML = '<p>No files found.</p>';
                }
                data.items.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';

                    // Preview gambar
                    if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.name)) {
                        const img = document.createElement('img');
                        img.src = `/uploads/${encodeURIComponent(item.name)}`;
                        img.alt = item.name;
                        img.className = 'result-image';
                        resultItem.appendChild(img);
                    }
                    // Preview PDF
                    else if (/\.pdf$/i.test(item.name)) {
                        const pdfPreview = document.createElement('embed');
                        pdfPreview.src = `/uploads/${encodeURIComponent(item.name)}`;
                        pdfPreview.type = 'application/pdf';
                        pdfPreview.className = 'result-pdf';
                        pdfPreview.width = "100%";
                        pdfPreview.height = "160";
                        resultItem.appendChild(pdfPreview);
                    }

                    // Nama file
                    const fileName = document.createElement('div');
                    fileName.textContent = item.name;
                    fileName.className = 'result-filename';
                    resultItem.appendChild(fileName);

                    // Link download
                    const link = document.createElement('a');
                    link.href = `/uploads/${encodeURIComponent(item.name)}`;
                    link.textContent = 'Download';
                    link.download = item.name;
                    link.className = 'result-download';
                    resultItem.appendChild(link);

                    resultsContainer.appendChild(resultItem);
                });

                // Update pagination buttons
                document.getElementById('prevPage').disabled = page <= 1;
                document.getElementById('nextPage').disabled = !data.hasMore;
                document.getElementById('currentPage').textContent = page;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Handler tombol search
    document.getElementById('searchButton').addEventListener('click', () => {
        currentPage = 1; // Reset ke halaman pertama
        fetchResults(currentPage);
    });

    // Handler tombol pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchResults(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage++;
        fetchResults(currentPage);
    });

    // Handler upload form dengan status
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const statusDiv = document.getElementById('uploadStatus');
            statusDiv.textContent = 'Uploading...';

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    statusDiv.textContent = data.message;
                } else {
                    statusDiv.textContent = 'Upload success!';
                }
                this.reset();
            })
            .catch(err => {
                statusDiv.textContent = 'Upload failed!';
            });
        });
    }
});