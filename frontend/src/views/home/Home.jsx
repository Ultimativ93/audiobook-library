import React from 'react'
import { Button } from '@chakra-ui/react';

import "../home/home.css";

const Home = () => {
  return (
    <div>
      <p>Home, wird später die Startseite des Portals. Im Moment noch in der URL /editor eingeben. Oder hier klicken:</p>
      <Button colorScheme='blue'>
        <a href="/user-projects" style={{}}>To Projects</a>
      </Button>

    </div>
  )
}

export default Home