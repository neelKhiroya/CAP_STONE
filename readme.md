#  *PatternDB*: Drum Pattern Database
### This database will allow a user to search any drum pattern on the website. Once seleteded, the drum pattern will be shown with the correct drum set for 8 bars. 

### Users can create their own drum patterns or allow others to join and edit the same drum pattern in real-time. 


# Installation and deployment
This installation guide uses the Docker Engine to simplify the deployment process and ensure reliability. 
Steps to install the Docker Engine can be found on their [website](https://docs.docker.com/desktop/).

## Step 1: Clone the repository
To download the project onto your system, clone this repository and navagate into the projects root folder.

## Step 2: Start the services
Using a terminal (or CMD) navigate to the root folder of the project and run the command:
    
    docker compose up -d

### rebuilding
If in need to rebuild the containers, the command:

    docker compose up -d --build

will do so. This can also reset the database and apply any changes in the codebase.

## Step 3: Using the frontend
After the containers have been built and are running, navigate to the fonntend found at [localhost:7230](http://localhost:7230/).

The homepage will show recent drum patterns and provide a search bar.
The collaboration feature can be found under *click to collaborate*, giving the option to create or join a room. 

## Step 4: Closing the application (containers)
To close down the application, navigate to the terminal used or back into the root folder.
Simply typing the command:

    docker compose down

will shut down the containers associated with the stack, closing the application safely. 
