import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

function DataUpload(props) {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const handleUpload = () => {
        setUploadedFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
      };
        console.log(files);
        console.log('files in DataUpload')
        console.log(uploadedFiles);
        console.log('files in DataUpload')

    return (
        <section className="container">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }} {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p style={{ width: '50vw', height: '30vh', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid black', borderStyle: 'dashed', borderRadius: '15px', backgroundColor: 'lightgrey', color: 'grey' }}>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
            <button style={{backgroundColor: 'lightblue', border: '2px solid black', borderRadius: '10px', padding: 5, marginTop: 10, width: 100, }} onClick={handleUpload}>Upload</button>
        </section>
    );
}

export default DataUpload;