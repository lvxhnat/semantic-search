### Quick Start 

1. Depending on your installer, download the related NVIDIA Container Toolkit [here](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-with-apt)
2. Check OS version and CUDA version installed on the local machine and change the image in backend/Dockerfile. In the sample Dockerfile, we use `nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04`.
```bash
# Check CUDA version
nvcc --version
# Check OS version
lsb_release -a
```
3. In ```/etc/docker/``` create the file ```daemon.json```, and paste
```
{
  "runtimes": {
    "nvidia": {
      "path": "nvidia-container-runtime",
      "runtimeArgs": []
    }
  }
}
```
4. Restart docker with ```sudo systemctl restart docker```.
5. Check if Nvidia runtime is properly setup in docker by running:
```bash
docker info | grep -i "runtime"
```
you should see nvidia contained in the runtime line.
5. Follow the guide in ```notebooks/setup.ipynb``` to Setup the intial vector database and text corpus in the ```data/``` directory. 
6. In ```docker/```, run 
```
docker compose up --build -d
```
7. [Optional] Access via SSH, run:
```bash
ssh lohyikuang@HOST_IP_ADDRESS -L 3000:localhost:3000 -L 1236:localhost:1236
```

### Structure 

The directory structure is described below:

```bash
|- docker/
   |__ backend/ # Contains the Dockerfile for frontend and backend
   |__ frontend/
   docker-compose.yaml # Composes backend and frontend using relative paths
|- backend
   |_ app/
        |__ api/
            |__ endpoints/
                |__ params.py # Contains the param validators in pydantic used for endpoints
                |__ query.py # Contains the endpoint definitions 
        |__ services/
            |__ chromadb.py
            |__ entrydb.py # Contains the links to the source database. Can be either csv or postgres
        
|- frontend
|- notebooks # Experimental Directory required for EDA 
|- mlengine # Experimental Directory
   |__ src
```

### Issues

Sometime, docker might run out of memory, since the container might be relatively large. If that happens you can do: 
```bash
docker system prune -a
# Then y 
```