# Inferno Tech

Inferno Tech is a static site with deployable API routes for:

- User registration and login
- Auth-required waitlist access
- Contact message create/read/update/delete
- MongoDB storage through Mongoose
- Formspree submissions for contact and waitlist notifications

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example`:

   ```bash
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/inferno_tech
   JWT_SECRET=replace-this-with-a-long-random-secret
   ```

   For deployment, use a MongoDB Atlas URI instead of local MongoDB.

3. Run locally:

   ```bash
   npm start
   ```

4. Open:

   ```text
   http://localhost:3000
   ```

## Deploying to Vercel

1. Push this folder to GitHub.

2. Create a MongoDB Atlas database.

3. In Vercel, import the GitHub project.

4. Add these Vercel environment variables:

   ```text
   MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/inferno_tech
   JWT_SECRET=use-a-long-random-secret
   ```

5. Deploy.

The API routes live in the `/api` folder, which Vercel runs as serverless functions.

## API routes

- `POST /api/auth/register` creates a user account.
- `POST /api/auth/login` logs in and returns a token.
- `GET /api/auth/me` reads the logged-in user.
- `GET /api/users/:id` reads a user account.
- `PATCH /api/users/:id` updates the logged-in user's account.
- `DELETE /api/users/:id` deletes the logged-in user's account.
- `POST /api/waitlist` joins the waitlist. Login is required.
- `POST /api/message` creates a contact message.
- `GET /api/message/:id` reads messages sent by a specific user ID.
- `PATCH /api/notes/:id` updates a message by message ID.
- `DELETE /api/message/:id` deletes a message by message ID.

## Important notes

- Do not commit `.env`.
- Do not commit `node_modules`.
- Use MongoDB Atlas for Vercel deployments.
- Keep your Formspree form IDs in `contact.html` and `waitlist.html`.
