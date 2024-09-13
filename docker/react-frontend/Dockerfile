# Use a base image with Nginx
FROM nginx:alpine

# Copy the React build archive to the container
COPY react-app.tar.gz /usr/share/nginx/html/

# Change directory to the Nginx html directory
WORKDIR /usr/share/nginx/html/

# Extract the archive
RUN tar -xzvf react-app.tar.gz

# Remove the archive after extraction
RUN rm react-app.tar.gz

# Expose port 80
EXPOSE 80