import React, { useState, useEffect } from 'react';
import { Card, Stack, CardFooter, Heading, Text, Image, Flex, Icon, Button } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import "../home/home.css";

import { handleGetAllValidatedFlows, handleGetValidatedFlowsCategories, handleGetValidatedFlowsDetails, handleSearchAudiobooks } from '../../components/tasks/homeTasks/HomeFunctions';
import { fetchThumbnail, fetchThumbnailImage } from '../../components/tasks/publishTasks/PublishFunctions';

// Home component, accessed of the route "/" from App.js. Handles the view of the validated audiobooks.
const Home = () => {
  const [validatedFlows, setValidatedFlows] = useState([]);
  const [thumbnailImages, setThumbnailImages] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [validatedDetails, setValidatedDetails] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
      if (validatedFlows.length > 0) {
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
                images[flow.id] = { image: imageData, title: flow.title };
              }
            } catch (error) {
              console.error('Error fetching thumbnail image: ', error);
            }
          }
        }
        setThumbnailImages(images);
      }
    };

    const fetchCategories = async (validatedFlowsNames) => {
      try {
        const categoriesData = await handleGetValidatedFlowsCategories(validatedFlowsNames);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    }

    const fetchDetails = async (validatedFlowsNames) => {
      try {
        const details = await handleGetValidatedFlowsDetails(validatedFlowsNames);
        setValidatedDetails(details);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    }

    if (validatedFlows.length > 0) {
      const validatedFlowsNames = validatedFlows.map(flow => ({ title: flow.title, flowKey: flow.flowKey }));
      fetchDetails(validatedFlowsNames)
      fetchCategories(validatedFlowsNames);
    }

    fetchThumbnails();
  }, [validatedFlows]);

  useEffect(() => {
    if (searchValue !== '') {
      setSearchResults(handleSearchAudiobooks(searchValue, validatedDetails));
    } else {
      setSearchResults([]);
    }
  }, [searchValue, validatedDetails]);

  const getFlowByTitle = (title) => {
    return validatedFlows.find(flow => flow.title === title);
  }

  return (
    <div className='home-wrapper'>
      <div className='home-container'>
        <div className='search-container'>
          <h2>Search for the best interactive Audiobooks!</h2>
          <div
            className={`search-input-container ${isSearchFocused ? 'focused' : ''}`}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          >
            <input
              placeholder='Search Audiobook'
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <Button className='search-button' size='lg' colorScheme='darkButtons'>Search</Button>
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className='search-results'>
              {searchResults.map((result, index) => {
                const flow = getFlowByTitle(result);
                return (
                  <Link to={`/audiobook/${flow.flowKey}`} key={index}>
                    <Card className='search-result-card'>
                      <Flex position='relative'>
                        <Image
                          className='search-result-card-image'
                          src={flow ? (thumbnailImages[flow.id]?.image || 'fallback-image-url') : 'fallback-image-url'}
                          alt={`Thumbnail-${result.title}`}
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
                          <Heading size='md' className='heading'>{result.title ? result.title : result.flowKey}</Heading>
                          <Text fontSize='sm' className='description'>
                            {result.description ? result.description.split(' ').slice(0, 20).join(' ') : ''}
                          </Text>
                        </Stack>
                      </Flex>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          <div className='search-categories'>
            {categories && categories.map((category, index) => (
              <Button colorScheme='highlightColor' key={index}>{category}</Button>
            ))}
          </div>
        </div>

        <h3>Audiobooks</h3>
        <div className='audiobooks-container'>
          {validatedFlows && validatedFlows.length > 0 && validatedFlows.map((flow, index) => (
            <Link to={`/audiobook/${flow.flowKey}`} key={index}>
              <Card className='home-audiobook-card' m={2}>
                <Flex position='relative' h='100%'>
                  <Image
                    className='home-audiobook-card-image'
                    src={thumbnailImages[flow.id]?.image || 'fallback-image-url'}
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