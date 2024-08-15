### Quick Start 

Run docker compose up with sudo privelages. This is required or a OCI Runtime error will be encountered, see [here](https://stackoverflow.com/questions/75585166/oci-runtime-error-when-running-docker-compose-with-nvidia-runtime-but-not-with)
```bash
cd docker/
## Sudoer accesss if required to allow Docker to access NVIDIA libraries and GPU available on the workstation.
sudo docker compose up --build -d
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