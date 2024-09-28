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

## Structure

The software has two main parts:
- backend developt using ASP.NET on .NET 8.0
- frontend developt using angular 18

Communication between backend and frontend is realised using [SignalR](https://learn.microsoft.com/en-us/aspnet/signalr/overview/getting-started/introduction-to-signalr) (because i wanted to play with that technology). The client code ist automatically generated using [NSwag](https://github.com/RicoSuter/NSwag). Because NSwag does not support SignalR hubs for client code generation, a DummyController exposes all classes used by the Hubs to the client by having them as return types.

TODO: describe
- Database used (Sqlite for now)
- Events (and how to create new events i ndeveloping section)
    - backend (EventProcessor and logic)
    - frontend (create-event.service.ts, process-event.service.ts, data.service.ts)


## Requirements for building

- .NET 8.0 SDK
- a supported version of Node.js & a package manager like npm or yarn
- Docker

## Complie & Run

### Initial

- run `npm install` or `yarn install` in `BigRoomPlanningBoardBackend/ng-big-room-planning`.
- restore nuget package for `BigRoomPlanningBoardBackend\BigRoomPlanningBoardBackend.csproj` (either using visual studio or the dotnet command line tool) 

### Visual Studio (recommended)

Run the "Container (Dockerfile)" launch configuration.
This will build frontend and backend and create a docker image. You will have to restart the debugging aufter you made changes to the frontend.

### Command Line

#### With Docker

Use the Dockerfile under `BigRoomPlanningBoardBackend` to create an image. I have not tried this, maybe you have to be one directory higher? Visual Studio seems to do some kind of nonsense with the base path in the Dockerfile.

#### Without docker

I have also never tried this so i am not sure this works. But you would have to

- build the frontend with `ng build` (under `BigRoomPlanningBoardBackend/ng-big-room-planning`).
- create the Folder `wwwroot` under `BigRoomPlanningBoardBackend` if it does not exist already.
- copy the content of `BigRoomPlanningBoardBackend/ng-big-room-planning/dist/browser` into the folder `BigRoomPlanningBoardBackend/wwwroot`.
    - unless you automate that task or somehow mangage to teach `ng b --watch` to not create that stupid `browser` folder and change the output paht in the angular.json, you will have to do this every time after you make changes to the frontend. Sorry about that. (If you manage to do so you are welcome to create a PR and change this documentation)

Then start the backend with `dotnet run` under `BigRoomPlanningBoardBackend`

## Requirements for Developing

Depending on the changes  you make you might need
- The Entity Framework dotnet tool installed globally (install with `dotnet tool install --global dotnet-ef`)
- NSwag Studio or a equivalent excecutable that can generate client code from `BigRoomPlanningBoard.nswag`

## Developing

Changes to any Class that is an Entity for Entity Framework require a Migration to be created.

Changes to any class that is exposed to the client (See `BigRoomPlanningBoardBackend/Controllers/DummyController.cs`) requires the client code to be updated, so does Exposing a new class via the DummyController (See [Structure](#structure) for reasons)

### Create a [EF Migration](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli) an apply it to the Debug-Database (BigRoomPlanningBoardBackend/debug.db) after changes to Entities

Under `BigRoomPlanningBoardBackend` run:
- `dotnet ef migrations add <YOUR-MIGRATION-NAME>`
    - Pick an meaningfull migration name like "AddNewEntityMyEntity" or "AddPropertyNameToMyEntity"
- `dotnet ef database update --connection "Data Source=debug.db"`
    - This will apply your changes to the debug.db file which is used during debugging

### Update client.ts after changes to classes exposed to the client

Note: Your must stop debugging before using NSwag Studio - it will recompile the project.

Open BigRoomPlanningBoard.nswag with NSwag-Studio and click "Generate files".