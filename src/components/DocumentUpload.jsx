import React, { useState } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import Modal from './Modal';

const API_BASE_URL = 'http://localhost:8080';

const DocumentUpload = ({ makeAuthenticatedRequest, isOpen, onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/document/upload`, 'POST', formData, true);
      toast.success('Document uploaded successfully');
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document">
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, or DOC (MAX. 10MB)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.doc" />
          </label>
        </div>
        {file && <p className="text-sm text-gray-500">Selected file: {file.name}</p>}
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onClose} className="mr-2">Cancel</Button>
          <Button type="submit">Upload Document</Button>
        </div>
      </form>
    </Modal>
  );
};

export default DocumentUpload;