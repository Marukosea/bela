const searchBar = document.getElementById('searchBar');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');

// Handle search on button click
searchButton.addEventListener('click', async () => {
    const query = searchBar.value.trim();
    resultsContainer.innerHTML = '';

    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a keyword.</p>';
        return;
    }

    resultsContainer.innerHTML = 'Searching...';

    try {
       const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();
        displayResults(results);
    } catch (err) {
        resultsContainer.innerHTML = '<p>Error fetching results.</p>';
    }
});

function displayResults(results) {
    resultsContainer.innerHTML = '';

    if (!results.length) {
        resultsContainer.innerHTML = '<p>No files found.</p>';
        return;
    }

    results.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.classList.add('file-item');

        const link = document.createElement('a');
        link.href = `/uploads/${file.name}`;
        link.textContent = file.name;
        link.download = file.name;

        fileElement.appendChild(link);
        resultsContainer.appendChild(fileElement);
    });
}