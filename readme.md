#   IDEA: Drum Pattern Database
### This database will allow a user to search any drum pattern on the website. Once seleted, the drum pattern will be shown with the correct drum set for 8 bars. 

### Users can create their own drum patterns in a live-time session, allowing other users to edit the same drum pattern in the same live time data. 


# Installation and deployment
This installation guide uses the Docker Engine to simplify the deployment process and ensure reliability. Steps to install the Docker Engine can be found on their [website](https://docs.docker.com/desktop/).

## Step 1: Clone the repository


##  PLAN
1. Create a live time chat using go websockets. This will set the foundation for sharing and creating real time drum patterns.

2. Create a smiple interactive graphic to create drum patterns, then implement the live chat feature such that the drum pattern will be real time data. 

3. Create a simple database allowing admins to add and delete drum patterns throught a front end. 

4. Create a front end that will sepertate but combine the database and live pattern feature. 

# RESEARCH
##  Live Chat:
    websockets : 
    - https://github.com/gorilla/websocket/tree/main/examples/chat

##  Drum pattern:
    Interactive WebGL: 

##  Database:
    Postgres: 
    - https://www.postgresql.org/docs/8.1/sql-delete.html
    - https://pkg.go.dev/github.com/jackc/pgx/v5

##  Invite code:
    Live chat rooms: 
    - https://medium.com/@parvjn616/building-a-websocket-chat-application-in-go-388fff758575
