# Big Room Planning Board

## Introduction

The last big room planning my squad/team had to attend to was planned using draw.io.
While draw.io is a versatile tool for other use cases, its really not build for that kind of thing.
There are multiple paid tools that can do this a lot better, but no one is willing to spend that money if draw.io "gets the job done" (sort of at least).


## Purpose of this Software

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
        - accept a risk

## Installation

A container iamge of the project is available at Docker Hub: `kahmannf/bigroomplanning:latest`.

Bind the container ports 8080 (http, optional) and 8081 (https). If you want to use https you will have to provide a certificate to the cotnainer using [ASP.NETs environment variables](https://learn.microsoft.com/en-us/aspnet/core/security/docker-https?view=aspnetcore-8.0).

If you want to test around without creating som Data you can set the environment-variable `APISETTINGS__CREATEDEBUGDATA` to `true`

The container will use SQLite the internal debug.db file to store any data. If you want to persist changes you will have to choose one of the following options:
- Mount a directory for a SQLite-File
- Use a PostgresSql DataBase or a MongoDb Database

### Mount a directory for a SQLite-File

Mount a directory containing a file called `prod.db` (name can be customized) that has the correct schema. Either
- copy and rename the current debug.db file from the image (located at `/app/debug.db`) or this repository at the correct tag (located at `BigroomPlanningBackend/debug.db`).
- or create a new file using the EntityFramework tooling (`dotnet ef database update --connection "Data Source=<your-file-name>"`), see below for more information.

Also set the environment variable `APISETTINGS__DBPATH` to the new file path of you BdFile in the container (e.g. `/app/db/prod.db`).

### Use a PostgresSql DataBase or a MongoDb Database (untested)

Set environment variable `APISETTINGS__DATABASEPROVIDER` to `MongoDB` or `Postgress`.
Set environment variable `APISETTINGS__CONNECTIONSTRING` to a connection string that can be reached from inside the container. 

### List of Container environment variables

|Variable|Description|Possible Values|Default Value|
|-|-|-|-|
|APISETTINGS__CONNECTIONSTRING|Connection string if APISETTINGS__DATABASEPROVIDER = "MongoDB" or "Postgress"|||
|APISETTINGS__CREATEDEBUGDATA|Will generate a few Tickets, Planned Periods and Sprints if set to true|true, false|false
|APISETTINGS__DATABASEPROVIDER|Defines which Database should be used|Sqlite, MongoDB, Postgress|Sqlite|
|APISETTINGS__DBPATH|Used to find the database file if APISETTINGS__DATABASEPROVIDER = "Sqlite"||./debug.db|
|APISETTINGS__MAXEVENTSPERUPDATE|Controls at which point the api will respond with the full data instead of an event list to save processing power on the client ||100|

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