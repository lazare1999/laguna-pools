# Stop and remove all containers
# shellcheck disable=SC2046
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q) --force

# Remove all volumes
docker volume rm $(docker volume ls -q) --force

# Remove all networks
docker network rm $(docker network ls -q) --force

# Remove all build cache
docker builder prune --all --force

# Comprehensive cleanup
docker system prune --all --volumes --force

# Check disk space
docker system df
