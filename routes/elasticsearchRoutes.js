const express = require('express');
const router = express.Router();
const { createIndex, indexDocument, searchDocuments, updateDocument, deleteDocument } = require('../controllers/elasticsearchController');

router.post('/createIndex', createIndex);
router.post('/indexDocument', indexDocument);
router.get('/searchDocuments', searchDocuments);
router.put('/updateDocument/:id', updateDocument);
router.delete('/deleteDocument/:id', deleteDocument);

module.exports = router;
