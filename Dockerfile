FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["backend/SubCityLetterSystem.Api/SubCityLetterSystem.Api.csproj", "SubCityLetterSystem.Api/"]
RUN dotnet restore "SubCityLetterSystem.Api/SubCityLetterSystem.Api.csproj"
COPY backend/SubCityLetterSystem.Api/ "SubCityLetterSystem.Api/"
RUN dotnet publish "SubCityLetterSystem.Api/SubCityLetterSystem.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "SubCityLetterSystem.Api.dll"]
