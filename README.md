# DEVBYTE WEBAPP

This is a full-stack web application for creating, browsing, and managing blog posts. It utilizes React for the front end, Firebase as a Backend as a Service (BaaS), Firestore for database management, and user authentication. The application also employs the Vite build tool and the toast notification library for user feedback.

## Features

- **User Authentication:** Users can log in to create and manage their blog posts.
- **Create Blog Posts:** Authenticated users can create new blog posts with titles, content, and optional images.
- **Browse Blog Posts:** Users can browse through existing blog posts, view their titles, content, authors, and publication dates.
- **Search Functionality:** Users can search for specific blog posts by entering keywords in the search bar.
- **Delete Blog Posts:** Authenticated users can delete their own blog posts.

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **Firebase:** A platform for building web and mobile applications without server-side programming.
- **Firestore:** A flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud.
- **Vite:** A next-generation frontend tooling that allows for faster development and build times.
- **Toast:** A notification library for displaying informative messages to users.

## Getting Started

To run this application locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install dependencies by running `npm install`.
4. Create a Firebase project and configure it according to the Firebase documentation.
5. Set up Firebase Authentication and Firestore for your project.
6. Create a `.env` file in the root directory and add your Firebase configuration details.
7. Run the application using `npm start`.
8. Access the application in your web browser at [http://localhost:3000](http://localhost:3000).

## Usage

Upon launching the application, users will see a list of existing blog posts. Authenticated users can log in to create new blog posts by clicking the "Create New Blog" button. Users can search for specific blog posts by entering keywords in the search bar. Authenticated users can delete their own blog posts by clicking the "Delete" button next to each post.

## Contributing

Contributions to this project are welcome. Feel free to open an issue or submit a pull request with any improvements or bug fixes.

## License

This project is licensed under the  [MIT LICENCE](LICENCE).
