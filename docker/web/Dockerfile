# Use a base image with .NET 6 SDK
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env

# Install Node.js v20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node -v \
    && npm -v

RUN dotnet tool install --global dotnet-ef --version 6.0.6

# Set the working directory inside the container
WORKDIR /app

# Copy the .NET project files to the container
COPY *.csproj ./

# Restore .NET dependencies
RUN dotnet restore

# Copy the rest of the application files
COPY . ./
# Build the .NET application
RUN dotnet publish -c Release -o out

# Use a lightweight runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

# Set the working directory for the runtime container
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build-env /app/out ./

# Expose a port for the application
EXPOSE 5000

# Set the entry point for the container
CMD ["dotnet", "TodoApi.dll"]
