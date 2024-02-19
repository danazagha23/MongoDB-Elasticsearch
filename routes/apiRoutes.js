

// Create an elasticsearch index
router.post('/createIndex', async (req, res) => {
    const indexName = req.body.indexName;
    await createIndex(indexName);
    res.json({ message: `${indexName} created successfully` });
});

// Indexing documents
router.post('/indexDocument', async (req, res) => {
    try {
        const indexName = req.body.indexName;
        const document = req.body.document;
        const result = await esClient.index({
            index: indexName,
            body: document
        })
        res.json({ message: `Document indexed to ${indexName} successfully`});
    } catch(error) {
        console.error(`Error indexing document:`, error);
        throw error;
    }
});

//Get all documents
router.get('/documents', async (req, res) => {
    try {
        const indexName = req.query.indexName;
        const result = await esClient.search({
            index: indexName,
            body: { query: { match_all: {} } },
        });
        res.json(result.body.hits.hits);
    } catch (error) {
        console.error('Error retrieving documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a document by name
router.get('/documents/byName', async (req, res) => {
    const documentName = req.query.documentName; 
    const indexName = req.query.indexName;
    try {
        const result = await esClient.search({
            index: indexName,
            body: {
                query: {
                    match: { name: documentName }
                }
            }
        });
        res.json(result.body);
    } catch (error) {
        console.error('Error retrieving document by Name:', error);
        if (error.statusCode === 404) {
            res.status(404).json({ error: 'Document not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Update a document by ID
router.put('/documents/:id', async (req, res) => {
    const documentId = req.params.id;
    const indexName = req.query.indexName;
    const updatedDocumentData = req.body;
    try {
        const result = await esClient.update({
            index: indexName,
            id: documentId,
            body: { doc: updatedDocumentData },
        });
        res.json(result);
    } catch (error) {
        console.error('Error updating document by ID:', error);
        if (error.statusCode === 404) {
            res.status(404).json({ error: 'Document not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Delete a document by ID
router.delete('/documents/:id', async (req, res) => {
    const documentId = req.params.id;
    const indexName = req.query.indexName;
    try {
        const result = await esClient.delete({
            index: indexName,
            id: documentId,
        });
        res.json(result);
    } catch (error) {
        console.error('Error deleting document by ID:', error);
        if (error.statusCode === 404) {
            res.status(404).json({ error: 'Document not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

module.exports = router;
