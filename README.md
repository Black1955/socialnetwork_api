# Social Network API

This is an API for a social network that allows users to register, sign in, create, and interact with posts. The API supports authorization, user management, and post recommendations.

## Table of Contents

## Technologies

- Node.js
- Express
- PostgreSQL
- TypeScript
- Docker

## Installation

1. Clone the repository:
   git clone <repository_url>
   cd <repository_folder>

## Start

### docker

- docker build -t socialnetwork-api .
- docker run socialnetwork-api

### local with node

- npm run faststart

## Configuration

PORT=5000
TOKEN=your_token
USER_DB=postgres
DB_PORT=5432
DB_PASSWORD=your_password
DB_HOST=localhost
DATABASE=socialnetwork
LOCAL_STORAGE_PATH=/file
ORIGIN=localhost

#### optional vars

FILESTACK_API_KEY=your_api_key
SECRET_FILE=your_secret_file

if i want you can store photos on a separete service

https://www.filestack.com/
you have to get an api key

## Usage

### Authorization

- Sign Up: POST /signup
- Sign In: POST /signin
- Refresh Token: GET /refresh

### Posts

- Get User Posts: GET /post?userId={id}
- Create Post: POST /post/create
- Get Recommended Posts: GET /post/recomendposts/{id}
- Like a Post: POST /post/like
- Dislike a Post: POST /post/dislike

### Users

- Get User: GET /getuser/{id}
- Subscribe to User: POST /subscribe
- Unsubscribe from User: POST /unsubscribe
- Search Users: GET /search
- Get Recommended User: GET /recomenduser/{userId}

## Request examples

### User Registration

    curl -X POST http://localhost:{PORT}/signup \
    -H "Content-Type: application/json" \
    -d '{"email": "example@example.com", "password": "password123", "nickname": "username"}'

### get a user

    curl -X GET http://localhost:{PORT}/getuser/1 \
    -H "Autorization: {your_token}"
