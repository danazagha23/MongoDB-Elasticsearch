const { create_Index, index_Document, search_Documents, update_Document, delete_Document } = require('../services/elasticsearchService');

const createIndex = async (req, res) => {
  const indexName = req.body.indexName;
  try {
    await create_Index(indexName);
    res.json({ message: `${indexName} created successfully` });
  } catch (error) {
    console.error(`Error creating index:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const indexDocument = async (req, res) => {
  const indexName = req.body.indexName;
  const document = req.body.document;
  try {
    await index_Document(indexName, document);
    res.json({ message: `Document indexed to ${indexName} successfully` });
  } catch (error) {
    console.error(`Error indexing document:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const searchDocuments = async (req, res) => {
  const indexName = req.query.indexName;
  const query = req.body.query;
  try {
    const result = await search_Documents(indexName, query);
    res.json(result);
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDocument = async (req, res) => {
  const documentId = req.params.id;
  const indexName = req.query.indexName;
  const updatedDocumentData = req.body;
  try {
    await update_Document(indexName, documentId, updatedDocumentData);
    res.json({ message: `Document updated successfully` });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteDocument = async (req, res) => {
  const documentId = req.params.id;
  const indexName = req.query.indexName;
  try {
    await delete_Document(indexName, documentId);
    res.json({ message: `Document deleted successfully` });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createIndex,
  indexDocument,
  searchDocuments,
  updateDocument,
  deleteDocument,
};
