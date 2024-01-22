### Audiobook-Library
This project aims to establish an interactive audiobook portal, focusing on empowering users through an editor to create and upload their personalized interactive audiobooks. The primary functionality of the application revolves around providing a platform for users to craft engaging narratives. It will feature a comprehensive editor enabling the creation of interactive elements within audiobooks. Additionally, a dedicated player will be integrated to facilitate seamless playback of these custom audiobooks.

As the project evolves, there are plans to incorporate community-centric features, fostering an environment where users can share, discover, and engage with each other's creative works. This multifaceted platform aspires to redefine the audiobook experience, combining user-generated content with interactive storytelling elements.

### Instalation
To set up the project, dependencies need to be installed in two separate directories. Eventually, this process will be streamlined in a startup script. Currently, run npm install in both the "frontend" and "backend" directories. The project is currently developed using Node.js version 21.6.0. Compatibility with older Node.js versions is under evaluation.

### Start
Once the installation is complete, you can launch the project by starting both the backend and frontend servers. In the "backend" directory, initiate the server with "node index.js." For the frontend, use "npm start" within the "frontend" directory. The backend server runs on "http://localhost:3005," while the frontend server runs on "http://localhost:3001" or on your network under "http://192.168.10.103:3001"  

### User Instruction
User instructions will be provided as the application continues to evolve. Currently, users have the ability to add "MuChoi" nodes (MultipleChoiceNodes). The nodes and edges are temporarily stored in the user's local storage and will be revamped in future updates.

After creating a "MuChoi" node, users can add a label to it by clicking on the node. In the select options, users can choose from the currently uploaded files.