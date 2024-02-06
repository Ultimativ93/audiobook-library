import React, { useState, useEffect } from 'react';
import { Card, Image, Stack, Heading, Text, ButtonGroup, Button, CardBody, CardFooter } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import '../userProjects/user-projects.css';

import FetchDetails from '../../components/tasks/projectsTasks/FetchDetails';
import { handleDeleteProject } from '../../components/tasks/projectsTasks/DeleteDetails';
import AudioBookSetup from '../audioBookSetup/AudiobookSetup';

const UserProjects = () => {
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsData = await FetchDetails();
        setDetails(detailsData);
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

  const handleProjectDeletion = async (audiobookTitle) => {
    const isDeleted = await handleDeleteProject(audiobookTitle);
    if (isDeleted) {
      reloadDetails();
    }
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
                    onClick={() => {
                      navigate('/', { state: { audiobookTitle: detail.audiobookTitle } });
                    }}
                  >
                    Start
                  </Button>
                  <Button
                    variant='solid'
                    colorScheme='red'
                    size='sm'
                    onClick={() => { handleProjectDeletion(detail.audiobookTitle) }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserProjects;
