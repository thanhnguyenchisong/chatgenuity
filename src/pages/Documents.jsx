import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const API_BASE_URL = 'http://localhost:8080';

const Documents = ({ openUploadModal, makeAuthenticatedRequest, refreshTrigger }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const fetchDocuments = async () => {
    try {
      const fetchedDocuments = await makeAuthenticatedRequest(`${API_BASE_URL}/policy`, 'GET');
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Uploaded Documents</h1>
      <Button onClick={openUploadModal} className="mb-4">Upload New Document</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell>{new Date(doc.uploadDate).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Documents;