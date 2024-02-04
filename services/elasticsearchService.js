const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
    node: 'http://elasticsearch:9200'
});

//create index
async function create_Index(indexName) {
    try {
        const result = await esClient.indices.create({
            index: indexName
        })
        console.log(`Index ${indexName} created`, result);
        return result;
    } catch(error) {
        console.error(`Error creating index ${indexName}:`, error);
        throw error;
    }
}

//index document
async function index_Document(indexName, documentId, document) {
    try {
        const result = await esClient.create({
            index: indexName,
            id: documentId,
            body: document
        })
        console.log(`Document indexed in '${indexName}':`, result);
    } catch (error) {
      console.error(`Error indexing document in '${indexName}':`, error);
      throw error;
    }
}

//search
async function search_Documents(indexName, query) {
    try {
      const result = await esClient.search({
        index: indexName,
        body: {
          query: query,
        },
      });
      console.log(`Search results in '${indexName}':`, result);
      return result.body.hits.hits;
    } catch (error) {
      console.error(`Error searching in '${indexName}':`, error);
      throw error;
    }
}


// Update document by ID
async function update_Document(indexName, documentId, updatedDocumentData) {
  try {
      const result = await esClient.update({
          index: indexName,
          id: documentId,
          body: { doc: updatedDocumentData },
      });
      console.log(`Document updated in '${indexName}':`, result);
  } catch (error) {
      console.error(`Error updating document in '${indexName}':`, error);
      throw error;
  }
}

// Delete document by ID
async function delete_Document(indexName, documentId) {
  try {
      const result = await esClient.delete({
          index: indexName,
          id: documentId,
      });
      console.log(`Document deleted in '${indexName}':`, result);
  } catch (error) {
      console.error(`Error deleting document in '${indexName}':`, error);
      throw error;
  }
}

module.exports = {
  create_Index,
  index_Document,
  search_Documents,
  update_Document,
  delete_Document,
  esClient
};