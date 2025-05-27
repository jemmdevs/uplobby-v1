# UpLobby - Project Repository

UpLobby is a platform for developers to showcase their projects. Built with Next.js 15, MongoDB, and Cloudinary, it allows users to register with NextAuth and upload their projects with images, titles, descriptions, and links.

## Features

- User authentication with NextAuth (Google, GitHub, and credentials)
- Project creation, editing, and deletion
- Image upload with Cloudinary
- MongoDB database integration
- Responsive design with MongoDB-inspired color scheme

## Technologies Used

- Next.js 15 (App Router)
- MongoDB for database
- Cloudinary for image storage
- NextAuth for authentication
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/uplobby.git
cd uplobby
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

The project uses the following environment variables which are set in the `next.config.mjs` file:

- `MONGODB_URI`: MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `NEXTAUTH_SECRET`: Secret for NextAuth

## Project Structure

- `/app`: Contains the Next.js application routes and pages
- `/components`: Reusable React components
- `/lib`: Utility functions and configurations
- `/models`: MongoDB schema models
- `/public`: Static assets

## API Routes

- `/api/auth/[...nextauth]`: NextAuth authentication endpoints
- `/api/projects`: Project CRUD operations
- `/api/upload`: Cloudinary image upload endpoint

## License

This project is licensed under the MIT License.
