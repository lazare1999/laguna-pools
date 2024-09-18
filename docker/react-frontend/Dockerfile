# Use an appropriate base image
FROM node:18-alpine

# Install a simple HTTP server
RUN npm install -g http-server

# Set the working directory
WORKDIR /usr/share/app

# Copy everything from public directory except index.html
COPY public/ /usr/share/app/
RUN rm /usr/share/app/index.html

# Copy the build files into the container
COPY dist /usr/share/app

# Expose port 3000
EXPOSE 3000

# Start the HTTP server
CMD ["http-server", "-p", "3000"]
