# Big Room Planning Board

## Introduction

The last big room planning my squad/team had to attend to was planned using draw.io.
While that is a versatile tool (if you live under a rock) its really not build for that kind of thing.
There are multiple paid tools that can do this a lot better, but noone is willing to spend that money if draw.io "gets the job done" (sort of at least).


## Goal of this Software

Provide a free, self-hostable web-application that can be used to conduct a Big Room Planning. This should not replace a good paid tool, but provide three basic features. 

- Define Planning Periods
    - Create a Planning Period with a start and end date and a date for the Big Room Planning
    - Create sprints that are within the defined period
        - for now, you can create sprints globally only - sprints per squad may be implemented in the future  
- Squads
    - Each Squad will get their own board per Planning Period
    - Create Tickets an assign them to Sprints
    - Assign risks to sprints
- Dependency Board
    - Mark tickets as depending on another ticket from another squad. They will appear on the dependency board automatically
    - Tickets that are are conflicting because of the arrangement in the sprints will be marked on the board
    - Mitigate risks
        - define mitigations for each risk if necessary 
        - accept a risk together (or let management decide, i dont care)

## Installation
TBD

## Requirements for building

- .NET 8.0 SDK
- a supported version of Node.js & a package manager like npm or yarn
- Docker

### Starting

#### Initial

- run `npm install` or `yarn install` in `ng-big-room-planning`.
- restore nuget package for `BigRoomPlanningBoardBackend\BigRoomPlanningBoardBackend.csproj` (either using visual studio or the dotnet command line tool) 

#### Visual Studio (recommended)

Run the "Container (Dockerfile)" launch configuration.
This will build frontend and backend and create a docker image. You will have to restart the debugging aufter you made changes to the frontend.

#### Commandline

I never used this so i am not sure this works. But you would have to

- build the frontend with `ng build` (under `ng-big-room-planning`).
- create the Folder `wwwroot` under `BigRoomPlanningBoardBackend` if it soes not exist already.
- copy the content of `ng-big-room-planning/dist/browser` into the folder `BigRoomPlanningBoardBackend/wwwroot`.
    - unless you automate that task or somehow mangage to teach `ng b --watch` to not create that stupid `browser` folder and change the output paht in the angular.json, you will have to do this every time after you make changes to the frontend. Sorry about that. (If you manage to do so you are welcome to create a PR and change this documentation)

Then start the backend with `dotnet run` under `BigRoomPlanningBoardBackend`