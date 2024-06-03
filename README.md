# Task Manager API

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/Charleskojomark/Task-Manager-Api.git
    cd task-manager-api
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file and add the following:
    ```env
    PORT=3000
    MONGODB_URI="Your MongoDB URI"
    ```

4. Start the server:
    ```sh
    npm start
    ```
5. Run test:
    ```sh
    npm test
    ```

## API Endpoints

### Create a New Task
- **URL:** `/api/tasks`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "Task 1",
    "description": "Description 1",
    "status": "pending",
    "due_date": "2023-06-01"
  }
  ```

### Get All Tasks
- **URL:** `/api/tasks`
- **Method:** `GET`

### Get a Single Task by ID
- **URL:** `/api/tasks/:id`
- **Method:** `GET`

### Update a Task by ID
- **URL:** `/api/tasks/:id`
- **Method:** `PUT`

### Delete a Task by ID
- **URL:** `/api/tasks/:id`
- **Method:** `DELETE`

### Get the Next Three Tasks Due
- **URL:** `/api/tasks/next-three`
- **Method:** `GET`

