# User Management System

This is a user management system API built using Node.js, Express.js, Prisma, and MongoDB.
## Getting Started  
1. Clone the repository: `git clone https://github.com/Ripon876/user-mangement-task.git`
2. Install dependencies: `yarn` or `npm install` 
3.  Set up environment variables: rename the .env.sample to .env and write variable values
4. Generate the Prisma schema: `npx prisma generate` or `yarn prisma generate`
5. Start the server: `yarn dev` or `yarn start` or `npm start`

## API Endpoints
-  **POST /signup**: Create a new user. 
-  **GET /verify/:token**: Verify email.
-  **POST /login**: Sign in  with email and password.
-  **GET  /users**: Get  all users.
-  **GET  /users/:id**: Get a specific  user .
- **PUT /users/:id**: Update a specific  user.
- **DELETE  /users/:id**: Delete a specific  user.