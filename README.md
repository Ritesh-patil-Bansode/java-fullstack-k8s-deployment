# Java Full Stack Kubernetes Deployment

A full-stack College Management System deployed using Docker, Kubernetes and AWS.

This project demonstrates how a Java Spring Boot backend, React frontend and MongoDB database can be containerized with Docker and deployed on a Kubernetes cluster running on AWS EC2.

The application provides CRUD operations for managing college users.

## Project Overview

The College Management System allows users to:

* Add a new student
* View all students
* Update student information
* Delete a student
* Store application data in MongoDB
* Run the backend inside Docker containers
* Run the frontend using Nginx
* Deploy the application using Kubernetes
* Use MongoDB StatefulSet for persistent database storage
* Use MongoDB Replica Set with three MongoDB pods
* Access the application through an AWS Load Balancer

## Technologies Used

### Frontend

* React
* Vite
* Bootstrap
* JavaScript
* Nginx

### Backend

* Java 21
* Spring Boot 3.5.5
* Spring Web
* Spring Data MongoDB
* Maven

### Database

* MongoDB 7
* MongoDB Replica Set
* MongoDB StatefulSet
* Persistent Volumes

### DevOps and Cloud

* Docker
* Kubernetes
* Kubernetes Deployment
* Kubernetes Service
* Kubernetes StatefulSet
* Kubernetes ConfigMap
* AWS EC2
* AWS Load Balancer
* Git
* GitHub

## Architecture

```text
                         Internet
                            |
                            v
                  AWS Load Balancer
                            |
                            v
             college-frontend-service
                         Port 80
                            |
                            v
                    React + Nginx
                            |
                     /api/users
                            |
                            v
                   college-svc
                      Port 8090
                            |
                            v
                Java Spring Boot
                     Backend
                            |
                            v
                 MongoDB Service
                            |
          +-----------------+-----------------+
          |                 |                 |
          v                 v                 v
     mongodb-0         mongodb-1         mongodb-2
       PRIMARY          SECONDARY          SECONDARY
          |                 |                 |
          +-----------------+-----------------+
                    MongoDB Replica Set
                           rs0
```

## Application Flow

```text
User
  |
  v
AWS Load Balancer
  |
  v
React Frontend
  |
  v
Nginx
  |
  | /api/users
  v
Java Spring Boot API
  |
  v
MongoDB Replica Set
  |
  +-- mongodb-0
  +-- mongodb-1
  +-- mongodb-2
```

## Main Features

### Create

Users can add a new student by providing:

* Name
* Email
* Course

The frontend sends a POST request to the Spring Boot backend.

### Read

The application retrieves all users from MongoDB using a GET request.

### Update

Existing user details can be updated using the Edit button.

The frontend sends a PUT request with the selected user ID.

### Delete

Users can be removed using the Delete button.

The frontend sends a DELETE request to the backend.

## REST API

Base URL:

```text
/users
```

### Get All Users

```http
GET /users
```

Example:

```bash
curl http://localhost:8090/users
```

Response:

```json
[
  {
    "id": "65abc123",
    "name": "Ritesh",
    "email": "ritesh@example.com",
    "course": "Computer Science"
  }
]
```

### Create User

```http
POST /users
```

Request body:

```json
{
  "name": "Ritesh",
  "email": "ritesh@example.com",
  "course": "Computer Science"
}
```

### Update User

```http
PUT /users/{id}
```

Request body:

```json
{
  "name": "Ritesh Bansode",
  "email": "ritesh@example.com",
  "course": "Computer Science"
}
```

### Delete User

```http
DELETE /users/{id}
```

## Project Structure

```text
java-fullstack-k8s-deployment/
|
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
|
├── java-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/example/college/
│   │       │       ├── CollegeApplication.java
│   │       │       ├── controller/
│   │       │       │   └── UserController.java
│   │       │       ├── model/
│   │       │       │   └── User.java
│   │       │       └── repository/
│   │       │           └── UserRepository.java
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   └── pom.xml
|
├── k8s/
│   ├── mongodb-service.yml
│   ├── mongodb-sts.yml
│   ├── configmap.yml
│   ├── deployment.yml
│   ├── college-svc.yml
│   ├── frontend-deployment.yml
│   └── frontend-service.yml
|
├── .gitignore
└── README.md
```

## Backend Details

The backend is developed using Java and Spring Boot.

The main components are:

### CollegeApplication

This is the main Spring Boot application class.

### User Model

The User model represents a college user stored in MongoDB.

Fields:

```text
id
name
email
course
```

### UserRepository

The repository extends MongoRepository and provides database operations.

```java
public interface UserRepository extends MongoRepository<User, String> {
}
```

Spring Data MongoDB provides database operations without requiring manual MongoDB queries for basic CRUD operations.

### UserController

The controller provides REST APIs for:

```text
GET
POST
PUT
DELETE
```

## MongoDB Configuration

MongoDB is deployed using a Kubernetes StatefulSet.

The StatefulSet contains three MongoDB pods:

```text
mongodb-0
mongodb-1
mongodb-2
```

MongoDB is configured as a Replica Set:

```text
rs0
```

The MongoDB configuration uses:

```text
--replSet rs0
--bind_ip_all
```

The three MongoDB pods provide:

```text
mongodb-0
mongodb-1
mongodb-2
```

One pod works as the Primary and the other two work as Secondary members of the Replica Set.

Data written to the Primary is replicated to the Secondary members.

## Why StatefulSet Is Used

MongoDB requires stable network identities and persistent storage.

Kubernetes StatefulSet provides:

* Stable pod names
* Stable network identities
* Persistent storage
* Ordered pod management
* Support for stateful applications

The MongoDB pods use:

```text
mongodb-0
mongodb-1
mongodb-2
```

Each pod receives its own PersistentVolumeClaim.

## MongoDB Service

A headless Kubernetes Service is used for MongoDB.

```text
Service Name: mongodb
Type: Headless Service
Port: 27017
```

The headless service allows MongoDB pods to communicate using stable DNS names.

Example:

```text
mongodb-0.mongodb
mongodb-1.mongodb
mongodb-2.mongodb
```

## Persistent Storage

MongoDB uses PersistentVolumeClaims created through the StatefulSet.

Storage configuration:

```text
Access Mode: ReadWriteOnce
Storage: 5Gi
```

This allows MongoDB data to remain available even when MongoDB pods are restarted.

## Kubernetes Deployment

The Java backend is deployed using a Kubernetes Deployment.

The application runs with two replicas.

```text
college-app
    |
    +-- Pod 1
    |
    +-- Pod 2
```

Running multiple backend replicas provides application redundancy and allows Kubernetes to distribute requests between the pods.

## Backend Service

The backend uses a Kubernetes ClusterIP Service.

```text
Service Name: college-svc
Port: 8090
Type: ClusterIP
```

The service provides an internal stable endpoint for communication between the frontend and backend.

The backend is not directly exposed to the internet.

## ConfigMap

A Kubernetes ConfigMap is used to provide the MongoDB connection string to the Java application.

Example:

```text
SPRING_DATA_MONGODB_URI
```

MongoDB connection:

```text
mongodb://mongodb-0.mongodb:27017,mongodb-1.mongodb:27017,mongodb-2.mongodb:27017/college?replicaSet=rs0
```

This allows the application configuration to be managed separately from the application image.

## Frontend

The frontend is developed using React and Vite.

The application provides:

* Student form
* User list
* Create operation
* Edit operation
* Delete operation
* Responsive Bootstrap UI

The production React application is built using:

```bash
npm run build
```

The generated `dist` directory is served using Nginx.

## Nginx

Nginx is used as the web server for the React production build.

It also works as a reverse proxy.

Frontend requests:

```text
/api/users
```

are forwarded by Nginx to:

```text
college-svc:8090/users
```

This allows the browser to communicate with the application using the same frontend domain.

## Docker

Docker is used to containerize both the frontend and backend.

### Backend Docker Image

```text
riteshbansode/college-app:2.0
```

The backend Docker image contains the Java Spring Boot application.

The container runs:

```text
Java 21
Spring Boot
```

on port:

```text
8090
```

### Frontend Docker Image

```text
riteshbansode/college-frontend:2.0
```

The frontend image contains:

```text
React production build
Nginx
```

and runs on port:

```text
80
```

## Kubernetes Services

The project uses different Kubernetes Service types for different requirements.

### MongoDB

```text
Service Type: Headless
```

Used for stable MongoDB pod discovery.

### Java Backend

```text
Service Type: ClusterIP
```

Used for internal communication.

### Frontend

```text
Service Type: LoadBalancer
```

Used to expose the application externally through an AWS Load Balancer.

## AWS Deployment

The Kubernetes cluster is running on AWS EC2 instances.

The frontend Kubernetes Service uses:

```text
type: LoadBalancer
```

Kubernetes provisions an AWS Load Balancer.

The traffic flow is:

```text
Internet
   |
   v
AWS Load Balancer
   |
   v
Frontend Kubernetes Service
   |
   v
React + Nginx Pods
   |
   v
Java Backend Service
   |
   v
Java Spring Boot Pods
   |
   v
MongoDB StatefulSet
```

## Deployment Process

The overall deployment process is:

```text
Develop Application
       |
       v
Build Java Application
       |
       v
Build React Application
       |
       v
Create Docker Images
       |
       v
Push Images to Docker Hub
       |
       v
Create Kubernetes Resources
       |
       v
Deploy MongoDB StatefulSet
       |
       v
Deploy Java Backend
       |
       v
Deploy React Frontend
       |
       v
Expose Frontend using AWS Load Balancer
       |
       v
Access Live Application
```

## Build Backend

Go to the backend directory:

```bash
cd java-backend
```

Build the Spring Boot application:

```bash
mvn clean package
```

The generated JAR file is:

```text
target/college.jar
```

## Build Backend Docker Image

```bash
docker build -t college-app:2.0 .
```

Tag the image:

```bash
docker tag college-app:2.0 riteshbansode/college-app:2.0
```

Push to Docker Hub:

```bash
docker push riteshbansode/college-app:2.0
```

## Build Frontend

Go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Build the React application:

```bash
npm run build
```

## Build Frontend Docker Image

```bash
docker build -t college-frontend:2.0 .
```

Tag the image:

```bash
docker tag college-frontend:2.0 riteshbansode/college-frontend:2.0
```

Push to Docker Hub:

```bash
docker push riteshbansode/college-frontend:2.0
```

## Deploy MongoDB

Apply the MongoDB Service:

```bash
kubectl apply -f k8s/mongodb-service.yml
```

Apply the MongoDB StatefulSet:

```bash
kubectl apply -f k8s/mongodb-sts.yml
```

Check MongoDB pods:

```bash
kubectl get pods
```

Expected:

```text
mongodb-0
mongodb-1
mongodb-2
```

## Deploy Backend

Apply ConfigMap:

```bash
kubectl apply -f k8s/configmap.yml
```

Apply backend Deployment:

```bash
kubectl apply -f k8s/deployment.yml
```

Apply backend Service:

```bash
kubectl apply -f k8s/college-svc.yml
```

Check backend:

```bash
kubectl get pods
kubectl get svc
```

Check deployment:

```bash
kubectl rollout status deployment/college-app
```

## Deploy Frontend

Apply frontend Deployment:

```bash
kubectl apply -f k8s/frontend-deployment.yml
```

Apply frontend Service:

```bash
kubectl apply -f k8s/frontend-service.yml
```

Check:

```bash
kubectl get pods
kubectl get svc
```

The frontend LoadBalancer provides the external endpoint for the application.

## Kubernetes Verification

Check all pods:

```bash
kubectl get pods
```

Check all services:

```bash
kubectl get svc
```

Check deployments:

```bash
kubectl get deployments
```

Check StatefulSet:

```bash
kubectl get statefulsets
```

Check PersistentVolumeClaims:

```bash
kubectl get pvc
```

Check MongoDB Replica Set:

```bash
kubectl exec -it mongodb-0 -- mongosh
```

Inside MongoDB:

```javascript
rs.status()
```

## Health and Troubleshooting Commands

Check pod details:

```bash
kubectl describe pod <pod-name>
```

Check application logs:

```bash
kubectl logs <pod-name>
```

Check backend logs:

```bash
kubectl logs deployment/college-app
```

Check frontend logs:

```bash
kubectl logs deployment/college-frontend
```

Check services:

```bash
kubectl get svc
```

Check endpoints:

```bash
kubectl get endpoints
```

## Docker Commands

List Docker images:

```bash
docker images
```

List running containers:

```bash
docker ps
```

Build an image:

```bash
docker build -t image-name:version .
```

Run a container:

```bash
docker run -p 8090:8090 image-name:version
```

## GitHub Workflow

The source code is maintained using Git and GitHub.

Basic workflow:

```text
Code Changes
     |
     v
git add .
     |
     v
git commit
     |
     v
git push
     |
     v
GitHub Repository
```

## Security

Sensitive information should not be committed to GitHub.

The project uses `.gitignore` to exclude unnecessary and sensitive files such as:

```text
node_modules/
dist/
target/
.env
*.log
```

Environment-specific configuration should be managed using Kubernetes ConfigMaps and Secrets where appropriate.

## Learning Outcomes

This project demonstrates practical knowledge of:

* Java Spring Boot
* REST API development
* MongoDB
* MongoDB Replica Sets
* React
* Nginx
* Docker
* Docker Hub
* Kubernetes
* Deployments
* StatefulSets
* Services
* ConfigMaps
* PersistentVolumeClaims
* Kubernetes networking
* Containerized application deployment
* AWS EC2
* AWS Load Balancer
* Git
* GitHub
* Full-stack application deployment

## Project Highlights

This project combines application development and DevOps practices in a single deployment.

The complete application consists of:

```text
React Frontend
       +
Java Spring Boot Backend
       +
MongoDB Replica Set
       +
Docker
       +
Kubernetes
       +
AWS
```

The application is deployed as separate frontend and backend workloads in Kubernetes, while MongoDB is deployed as a StatefulSet with persistent storage and replica set configuration.

## Author

Ritesh Bansode

B.Tech Computer Science Student

GitHub:

https://github.com/Ritesh-patil-Bansode

## Project Repository

https://github.com/Ritesh-patil-Bansode/java-fullstack-k8s-deployment

## Project Type

Full Stack Application Deployment using DevOps and Kubernetes.

## Final Architecture Summary

```text
                     AWS CLOUD
                         |
                         v
                AWS Load Balancer
                         |
                         v
              React Frontend Service
                         |
                         v
                  Nginx Container
                         |
                         v
              Java Backend Service
                         |
                         v
             Spring Boot Containers
                    2 Replicas
                         |
                         v
               MongoDB Headless Service
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
     MongoDB-0      MongoDB-1      MongoDB-2
      Primary       Secondary      Secondary
          |              |              |
          +--------------+--------------+
                    Replica Set
                        rs0
```

This project demonstrates how a complete full-stack application can be containerized, orchestrated and deployed on Kubernetes using AWS infrastructure.
