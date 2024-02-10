import React, { useState, useEffect } from 'react';
import { Card, Image, Stack, Heading, Text, ButtonGroup, Button, CardBody, CardFooter, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import '../userProjects/user-projects.css';

import FetchDetails from '../../components/tasks/projectsTasks/FetchDetails';
import UserProjectsDeleteModal from '../../components/layoutComponents/layoutUserProjects/UserProjectsDeleteModal';
import UserProjectsAddModal from '../../components/layoutComponents/layoutUserProjects/UserProjectAddModal';

const UserProjects = () => {
  const [details, setDetails] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
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

  // Reload details after deletions of a project.
  const reloadDetails = async () => {
    try {
      const detailsData = await FetchDetails();
      setDetails(detailsData);
    } catch (error) {
      console.error('Error reloading details:', error);
    }
  };

  const handleDeleteButtonClick = (audiobookTitle) => {
    setSelectedProject(audiobookTitle);
    setIsModalDeleteOpen(true);
  };

  // Handle add project
  const handleAddProject = () => {
    setIsModalAddOpen(true);
  }

  return (
    <div className='user-projects-wrapper'>

      <Button colorScheme='blue' leftIcon={<AddIcon />} onClick={() => handleAddProject()}>
        Create New Audiobook
      </Button>

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
                    {parsedDetailData && parsedDetailData.description ? parsedDetailData.description.split(" ").slice(0, 20).join(" ") : ''}
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
                    <Link to={`/editor/${detail.audiobookTitle}`} state={{ new: newAudiobook }}>
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

      {isModalDeleteOpen && (
        <UserProjectsDeleteModal isModalDeleteOpen={isModalDeleteOpen} setIsModalDeleteOpen={setIsModalDeleteOpen} selectedProject={selectedProject} reloadDetails={reloadDetails} />
      )}

      {isModalAddOpen && (
        <UserProjectsAddModal isModalAddOpen={isModalAddOpen} setIsModalAddOpen={setIsModalAddOpen} />
      )}

    </div>
  );
};

export default UserProjects;
