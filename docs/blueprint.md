# **App Name**: Ultra AI Assistant

## Core Features:

- Authentication: User Authentication: Allow users to sign up and sign in using FirebaseUI Auth, supporting email/password and federated sign-in flows.  Role-based access will restrict access to UI elements.
- Webhook Management: Webhook Management Interface: Provide a UI for users to add, edit (URL, name, Basic Auth credentials), rename, and delete their AI assistant webhooks.  Include fields for webhook name, URL, username, and password. Use appropriate input types (e.g., password field for password).
- Webhook Relay: Webhook Relay: Utilize a secure Cloud Function to relay user messages to the specified webhook and return the AI's response to the user. The function will act as a tool that analyzes the prompt and decides when or not to include the assistant response, and will then relay the prompt to n8n, decrypt webhook credentials and apply Basic Authentication headers.
- File Uploads: File Uploads: Enable users to upload files (e.g., avatars) using Firebase Storage. The file uploader should support common image formats. Use file metadata to display thumbnails and file names.
- Responsive Design: Responsive Layout: Use a responsive layout that adapts to different screen sizes (desktop, tablet, mobile) using Firebase Studio's responsive components and theming. Navigation is done with standard web UI

## Style Guidelines:

- Primary color: A vibrant purple (#9D4EDD) to convey innovation and intelligence. This will grab user attention and give a modern look to the app.
- Background color: A light desaturated purple (#F5EEF8), brightness adjusted for a light scheme, provides a clean backdrop that will contrast well with the primary.
- Accent color: A complementary pink (#E94560), contrasting in brightness and saturation with the primary, used sparingly for calls to action, important alerts, or to highlight active UI elements.
- Body and headline font: 'Inter' (sans-serif) provides a clean, modern look that suits application user interfaces.
- Use simple, outlined icons from a library like Material Icons for common actions such as uploading, editing, and deleting. Color them with the primary color to create visual consistency.
- Use a grid-based layout with adequate padding around elements to maintain readability and a sense of order. Ensure the layout is responsive across different devices.
- Subtle transitions when displaying AI responses.