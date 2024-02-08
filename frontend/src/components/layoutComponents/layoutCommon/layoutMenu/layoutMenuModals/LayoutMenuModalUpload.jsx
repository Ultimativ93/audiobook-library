import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

const LayoutMenuModalUpload = ({ isModalUploadOpen, setModalsState, audiobookTitle }) => {
    const [uploadSuccess, setUploadSuccess] = useState(false);
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
            <Modal isOpen={isModalUploadOpen} onClose={() => setModalsState(prevState => ({ ...prevState, isUploadModalOpen: false }))}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Audio</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <section className="container">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }} {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p style={{ width: '50vw', height: '30vh', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid black', borderStyle: 'dashed', borderRadius: '15px', backgroundColor: 'lightgrey', color: 'grey' }}>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                            <aside>
                                <h4>Files</h4>
                                <ul>{files}</ul>
                                <h4>Rejected files</h4>
                                <ul>{fileRejectionItems}</ul>
                            </aside>
                            <button style={{ backgroundColor: 'lightblue', border: '2px solid black', borderRadius: '10px', padding: 5, marginTop: 10, width: 100, }} onClick={handleUpload}>Upload</button>
                            {uploadSuccess && <p>Ur files have been successfully uploaded to the server!</p>}
                        </section>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
}

export default LayoutMenuModalUpload;
