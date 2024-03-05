import React, { useState, useEffect } from 'react';
import { Card, Image, Stack, Heading, Text, ButtonGroup, Button, CardBody, CardFooter } from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import '../userProjects/user-projects.css';

import FetchDetails from '../../components/tasks/projectsTasks/FetchDetails';
import UserProjectsDeleteModal from '../../components/layoutComponents/layoutUserProjects/UserProjectsDeleteModal';
import UserProjectsAddModal from '../../components/layoutComponents/layoutUserProjects/UserProjectAddModal';
import { fetchThumbnail, fetchThumbnailImage } from '../../components/tasks/publishTasks/PublishFunctions';
import { handleFetchFlows } from '../../components/tasks/setupTasks/FetchDetails';

const UserProjects = () => {
  const [details, setDetails] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [newAudiobook, setNewAudiobook] = useState(false);
  const [thumbnailImages, setThumbnailImages] = useState({});
  const [flows, setFlows] = useState({});

  const location = useLocation();

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const flowsData = await handleFetchFlows();
        console.log("FlowData: ", flowsData.allFlows)
        setFlows(flowsData.allFlows);
      } catch (error) {
        console.error('Error fetching flows:', error);
      }
    };

    fetchFlows();
  }, []);

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
  }, [location.state?.new]);

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (details) {
        const images = {};
        for (const detail of details) {
          const parsedDetailData = detail.detailData ? JSON.parse(detail.detailData) : null;
          const thumbnailURL = parsedDetailData && parsedDetailData.thumbnail ? parsedDetailData.thumbnail : '';
          if (thumbnailURL) {
            try {
              const paths = await fetchThumbnail(detail.audiobookTitle);
              if (paths && paths.length > 0) {
                const imageData = await fetchThumbnailImage(paths[0].audioPath);
                images[detail.id] = imageData;
              }
            } catch (error) {
              console.error('Error fetching thumbnail image:', error);
            }
          }
        }
        setThumbnailImages(images);
      }
    };

    fetchThumbnails();
  }, [details]);

  // Handle delete project
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
        {details && details.map((detail, index) => {
          const parsedDetailData = detail.detailData ? JSON.parse(detail.detailData) : null;
          const thumbnailImage = thumbnailImages[detail.id];
          const flow = flows[index];
          console.log("flow in map", flow);

          return (
            <Card key={detail.id} className='user-projects-card'>
              <Image
                className='user-projects-card-image'
                src={thumbnailImage ? thumbnailImage : process.env.PUBLIC_URL + '/grafics/Standard-Thumbnail-small.png'}
                alt='Thumbnail'
                borderRadius='lg'
              />
              <CardBody>
                <Stack>
                  <Heading size='md'>{detail.audiobookTitle}</Heading>
                  <Text>
                    {parsedDetailData && parsedDetailData.description ? parsedDetailData.description.split(" ").slice(0, 20).join(" ") : ''}
                  </Text>
                  <Text>
                    {flow ? `Number of nodes: ${JSON.parse(flow.flowData).nodes.length}` : 'Fetching flow...'}
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
        <UserProjectsDeleteModal isModalDeleteOpen={isModalDeleteOpen} setIsModalDeleteOpen={setIsModalDeleteOpen} selectedProject={selectedProject} />
      )}

      {isModalAddOpen && (
        <UserProjectsAddModal isModalAddOpen={isModalAddOpen} setIsModalAddOpen={setIsModalAddOpen} />
      )}

    </div>
  );
};

export default UserProjects;
