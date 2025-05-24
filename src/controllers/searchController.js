class SearchController {
    constructor(fileModel, fileUtils) {
        this.fileModel = fileModel;
        this.fileUtils = fileUtils;
    }

    searchFiles(req, res) {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({ error: 'Search term is required' });
        }
        try {
            const files = this.fileUtils.searchFiles(searchTerm);
            const results = files.map(file => new this.fileModel(file.name, file.type, file.path));
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while searching for files' });
        }
    }
}

module.exports = SearchController;