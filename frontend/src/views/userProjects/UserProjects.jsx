import React, { useState, useEffect } from 'react';
import { Card, Image, Stack, Heading, Text, ButtonGroup, Button, CardBody, CardFooter, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import '../userProjects/user-projects.css';

import FetchDetails from '../../components/tasks/projectsTasks/FetchDetails';
import { handleDeleteProject } from '../../components/tasks/projectsTasks/DeleteDetails';
import AudioBookSetup from '../audioBookSetup/AudiobookSetup';

const UserProjects = () => {
  const [details, setDetails] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAudiobook, setNewAudiobook] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsData = await FetchDetails();
        setDetails(detailsData);
        setNewAudiobook(location.state?.new || false);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, []);

  const reloadDetails = async () => {
    try {
      const detailsData = await FetchDetails();
      setDetails(detailsData);
    } catch (error) {
      console.error('Error reloading details:', error);
    }
  };

  const handleProjectDeletion = async () => {
    const isDeleted = await handleDeleteProject(selectedProject);
    if (isDeleted) {
      reloadDetails();
    }
    setIsModalOpen(false); // Close the modal after deletion
  };

  const handleDeleteButtonClick = (audiobookTitle) => {
    setSelectedProject(audiobookTitle);
    setIsModalOpen(true); // Open the modal when the delete button is clicked
  };

  return (
    <div className='user-projects-wrapper'>
      <AudioBookSetup />

      <div className='user-projects'>
        {details && details.map((detail) => {
          const parsedDetailData = detail.detailData ? JSON.parse(detail.detailData) : null;

          return (
            <Card key={detail.id} className='user-projects-card'>
              <Image
                className='user-projects-card-image'
                src={process.env.PUBLIC_URL + '/grafics/Standard-Thumbnail-small.png'}
                alt='Standard Thumbnail'
                borderRadius='lg'
              />
              <CardBody>
                <Stack>
                  <Heading size='md'>{detail.audiobookTitle}</Heading>
                  <Text>
                    {parsedDetailData && parsedDetailData.description ? parsedDetailData.description.split(" ").slice(0, 50).join(" ") : ''}
                  </Text>
                </Stack>
              </CardBody>
              <CardFooter>
                <ButtonGroup>
                  <Button
                    variant='solid'
                    colorScheme='blue'
                    size='sm'
                  >
                    <Link to={`/editor/${detail.audiobookTitle}`} state={{ new: newAudiobook }}> {/* Übergebe newAudiobook über den Router-Zustand */}
                      Start
                    </Link>
                  </Button>
                  <Button
                    variant='solid'
                    colorScheme='red'
                    size='sm'
                    leftIcon={<DeleteIcon />}
                    onClick={() => { handleDeleteButtonClick(detail.audiobookTitle) }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>


          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this project?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} leftIcon={<DeleteIcon />} onClick={handleProjectDeletion}>
              Delete
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserProjects;
