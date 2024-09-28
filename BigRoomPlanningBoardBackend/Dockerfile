# Unter https://aka.ms/customizecontainer erfahren Sie, wie Sie Ihren Debugcontainer anpassen und wie Visual Studio dieses Dockerfile verwendet, um Ihre Images für ein schnelleres Debuggen zu erstellen.

# Diese Stufe wird verwendet, wenn sie von VS im Schnellmodus ausgeführt wird (Standardeinstellung für Debugkonfiguration).
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Diese Stufe wird zum Erstellen des Dienstprojekts verwendet.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["BigRoomPlanningBoardBackend/BigRoomPlanningBoardBackend.csproj", "BigRoomPlanningBoardBackend/"]
RUN dotnet restore "./BigRoomPlanningBoardBackend/BigRoomPlanningBoardBackend.csproj"
COPY . .
WORKDIR "/src/BigRoomPlanningBoardBackend"
RUN dotnet build "./BigRoomPlanningBoardBackend.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM node:latest AS buildfrontend

WORKDIR "/src"

COPY "BigRoomPlanningBoardBackend/ng-big-room-planning" .

RUN npm install
RUN npm run build



# Diese Stufe wird verwendet, um das Dienstprojekt zu veröffentlichen, das in die letzte Phase kopiert werden soll.
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./BigRoomPlanningBoardBackend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Diese Stufe wird in der Produktion oder bei Ausführung von VS im regulären Modus verwendet (Standard, wenn die Debugkonfiguration nicht verwendet wird).
FROM base AS final
WORKDIR /app
COPY --chown=app:app --from=publish /app/publish .
COPY --chown=app:app BigRoomPlanningBoardBackend/debug.db /app/
WORKDIR /app/wwwroot
COPY --chown=app:app --from=buildfrontend /src/dist/ng-big-room-planning/browser .
WORKDIR /app
ENTRYPOINT ["dotnet", "BigRoomPlanningBoardBackend.dll"]