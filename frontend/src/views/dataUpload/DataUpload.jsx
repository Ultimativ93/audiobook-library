import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';

import '../dataUpload/data-upload.css';

const DataUpload = () => {
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const { audiobookTitle } = useParams();
    console.log("audiobookTitle", audiobookTitle);

    const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/jpeg': ['.jpeg'],
            'audio/mpeg': ['.mpeg'],
            'audio/mp3': ['.mp3'],
            'audio/aac': ['.aac'],
            'audio/wav': ['.wav'],
            'audio/ogg': ['.ogg'],
            'audio/m4a': ['.m4a'],
        },
        maxFiles: 50,
    });


    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append('files', file);
            });
            formData.append('audiobookTitle', audiobookTitle);
    
            const response = await fetch('http://localhost:3005/upload', {
                method: 'POST',
                body: formData,
            });
    
            console.log('Response:', response);
    
            const responseData = await response.json();
            console.log('Response Data:', responseData);
            console.log('Response.ok: ', response.ok);
    
            if (response.ok) {
                console.log('Nice! Files uploaded successfully:', responseData.message);
                setUploadSuccess(true);
            } else {
                console.error('Error uploading files');
                setUploadSuccess(false);
            }
        } catch (error) {
            console.error('Error in catch:', error);
            setUploadSuccess(false);
        }
    };


    return (
        <>
            <section className="data-upload-container">
                <div className="data-upload-dropzone"  {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                    <h4>Rejected files</h4>
                    <ul>{fileRejectionItems}</ul>
                </aside>
                <button onClick={handleUpload}>Upload</button>
                {uploadSuccess && <p>Ur files have been successfully uploaded to the server!</p>}
            </section>
        </>
    );
}

export default DataUpload;
