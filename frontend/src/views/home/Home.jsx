import React, { useState, useEffect } from 'react';
import { Card, Stack, CardFooter, Heading, Text, Image, Flex, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import "../home/home.css";

import { handleGetAllValidatedFlows } from '../../components/tasks/homeTasks/HomeFunctions';
import { fetchThumbnail, fetchThumbnailImage } from '../../components/tasks/publishTasks/PublishFunctions';

// Home component, accessed of the route "/" from App.js. Handles the view of the validated audiobooks.
const Home = () => {
  const [validatedFlows, setValidatedFlows] = useState([]);
  const [thumbnailImages, setThumbnailImages] = useState({});

  useEffect(() => {
    const fetchValidatedFlows = async () => {
      try {
        const validatedFlowsData = await handleGetAllValidatedFlows();
        setValidatedFlows(validatedFlowsData.allValidatedFlows);
      } catch (error) {
        console.error('Error fetching validated flows: ', error);
      }
    }
    fetchValidatedFlows();
  }, []);

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (validatedFlows) {
        const images = {};
        for (const flow of validatedFlows) {
          const thumbnail = flow.thumbnail;
          if (thumbnail) {
            try {
              let paths = await fetchThumbnail(flow.flowKey);
              if (!paths) {
                paths = await fetchThumbnail(flow.title);
              }
              if (paths) {
                const imageData = await fetchThumbnailImage(paths);
                images[flow.id] = imageData;
              }
            } catch (error) {
              console.error('Error fetching thumbnail image: ', error);
            }
          }
        }
        setThumbnailImages(images);
      }
    };
  
    fetchThumbnails();
  }, [validatedFlows]);

  return (
    <div className='home-wrapper'>
      <div className='home-container'>
        <div className='logo-container'>
          <img src={process.env.PUBLIC_URL + '/graphics/Earcade-Logo.png'} alt='Earcade Logo' className='earcade-logo' />
          <div className='svg-background'/>
          <p className='earcade-slogan'>Your Gateway to Interactive Audiobooks</p>
        </div>
        
        <h3>Audiobooks</h3>

        <div className='audiobooks-container'>
          {validatedFlows && validatedFlows.length > 0 && validatedFlows.map((flow, index) => (
            <Link to={`/audiobook/${flow.flowKey}`} key={index}>
              <Card className='home-audiobook-card' m={2} maxW='300px'>
                <Flex position='relative' h='100%'>
                  <Image
                    className='home-audiobook-card-image'
                    src={thumbnailImages[flow.id]}
                    alt={`Thumbnail-${flow.title}`}
                    borderRadius='lg'
                  />
                  <Stack
                    position='absolute'
                    bottom='0'
                    left='0'
                    right='0'
                    px={4}
                    py={2}
                    bgGradient='linear(to-t, blackAlpha.600, transparent)'
                    color='white'
                    borderBottomRadius='lg'
                  >
                    <Heading size='md' className='heading'>{flow.title ? flow.title : flow.flowKey}</Heading>
                    <Text fontSize='sm' className='description'>
                      {flow.description ? flow.description.split(' ').slice(0, 20).join(' ') : ''}
                    </Text>
                  </Stack>
                </Flex>
                <CardFooter padding='10px' className='rating'>
                  <Flex align='center'>
                    <Text>Rating: </Text>
                    <Icon as={FaStar} color='orange.400' />
                    <Icon as={FaStar} color='orange.400' />
                    <Icon as={FaStar} color='orange.400' />
                    <Icon as={FaStar} color='orange.400' />
                    <Icon as={FaStar} color='gray.300' />
                  </Flex>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        <h3>Kategorien</h3>      
      </div>
    </div>
  );
}

export default Home;