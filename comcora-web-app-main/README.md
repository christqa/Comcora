# Comcora Web 

This is a Next.js project based on a feature-based architecture to improve scalability and maintainability. The following sections provide a detailed overview of the file structure, development practices, and guidelines for working on this project.

## 📂 Project File Structure

```
public                # static data served as is
|
src                   # main source code
|
+-- app               # application file-based routing (Next.js)
|   |
|   +-- page1         # application page 1
|   |
|   +-- page2         # application page 2
|   |
|   +-- api           # REST API endpoints
|
+-- assets            # assets folder contains all static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application (e.g., layout parts like Footer, Header, etc.)
|   +-- ui            # reusable UI components (UI Kit)
|
+-- features          # feature-based modules (explained below)
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # reusable libraries preconfigured for the application and shared utility functions
|
+-- types             # shared types used across the application
|
+-- server            # backend logic (Next.js API and tRPC routers)
```

## 📦 UI Kit

The project’s **UI Kit** is located in `src/components/ui`, and it contains reusable UI components like buttons, inputs, modals, and alerts.

- **UI Kit (`src/components/ui`)**:
    - This directory contains all reusable UI components.
    - You can access the UI components via the alias `@/components/ui`. This ensures that all shared and standardized UI components are centralized in one place.
    - Example of using a button component from the UI kit:
      ```tsx
      import { Button } from "@/components/ui/Button";
      ```

## 📦 API Client SDK

This project integrates the `@xdatagroup/tbb-sdk`, which handles the API Client:

- **API Client (`@xdatagroup/tbb-sdk/api`)**:
    - This package contains the API client logic used to interact with the backend.
    - You can access the API client via the alias `@xdatagroup/tbb-sdk/api`.
    - Example of using the API client:
      ```tsx
      import { businessApiControllers } from "@xdatagroup/tbb-sdk/api";
      
      const summary = await businessApiControllers.accounts.accountSummary(accountId, httpClient);
      ```

## 📂 Feature-Based Structure

Each feature is organized into its own folder under `src/features`, with specific subdirectories for different concerns like API, components, hooks, and utilities.

```
src/features/awesome-feature
|
+-- api         # exported API request declarations and api hooks related to a specific feature
|
+-- assets      # static files scoped to the specific feature (images, etc.)
|
+-- components  # components scoped to a specific feature
|
+-- hooks       # hooks (including context API) scoped to the feature
|
+-- stores      # state stores for the feature (if applicable, like Zustand, Redux)
|
+-- types       # TypeScript types used within the feature
|
+-- utils       # utility functions specific to this feature
```

### 📁 Example: `src/features/profile`

```
src/features/profile
|
+-- api             # API hooks and requests related to profile
|
+-- components      # UI components for profile (e.g., ProfilePhotoSection, EmailSection)
|
+-- hooks           # hooks related to profile (e.g., useProfile, useAvatarUpload)
|
+-- types           # TypeScript types related to profile
|
+-- utils           # Utility functions related to profile (e.g., data formatting)
|
+-- stores          # State management logic for the profile (if applicable)
|
+-- assets          # Profile-related images or assets
```

## 📁 Shared Components Structure

In our project, we use a clear separation for where components are stored based on their purpose and scope:

### **UI Kit (`src/components/ui`)**
- All **common reusable UI components** like buttons, inputs, modals, alerts, etc., are stored in the `src/components/ui` directory.
- These components are custom-built and can be accessed via the alias `@/components/ui`.

  Example:
  ```tsx
  import { Button } from "@/components/ui/Button";
  ```

### **Feature-Specific Components**
- **Form management, validation, and inputs** are scoped to their respective features and are stored within the relevant feature folder.

  Example structure for feature-specific components:
  ```
  src/features/profile
  |
  +-- components
  |   |
  |   +-- ProfileForm.tsx
  |   +-- ProfilePhotoUpload.tsx
  ```

  Example usage:
  ```tsx
  import ProfileForm from "@/features/profile/components/ProfileForm";
  ```

### **Product-Specific Shared Components (`src/components`)**
- Components in the `src/components` directory are **unique per product** but not tied to any specific feature. These typically include **layout parts** such as the `Footer`, `Header`, `NavBar`, and `Menu`.

## 💡 Development Guidelines

### 1. **Form Management**
- We use `react-hook-form` for form handling, with `zod` for validation.
- Form components should use the following pattern:
    - `FormItem`: Each form field wrapper.
    - `FormControl`: Wrapper for inputs and controls.
    - `FormMessage`: Error or validation messages.

Example:
   ```tsx
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)}>
       <FormField
         name="email"
         control={form.control}
         render={({ field }) => (
           <FormItem>
             <FormControl>
               <Input {...field} placeholder="Email" />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />
     </form>
   </Form>
   ```

### 2. **API Layer**

On the client side, we use **tRPC** to make type-safe requests to the **Next.js backend layer**. The backend layer is configured with **routers** that handle user session logic and proxy the requests to an external API via the `@xdatagroup/tbb-sdk/api` package.

#### Client-Side API Requests
- On the client side, all API requests are handled via `tRPC`. The client uses tRPC hooks such as `useQuery` and `useMutation` to make type-safe API calls to the backend.

  Example:
  ```tsx
  import { trpc } from "@/lib/trpc";
  
  const { data, error } = trpc.user.getUserData.useQuery();
  ```

#### Backend-Side (Proxy Layer)
- The **Next.js backend** is set up as a proxy layer to handle requests securely. The backend communicates with the core API (via the `@xdatagroup/tbb-sdk/api` package) rather than directly exposing the core API to the client.
- This architecture ensures that sensitive API endpoints are not exposed to the end user. The backend handles user session logic, which allows for secure communication with the core API.

#### Backend API Routers
- All backend routers are configured in `src/server/api/routers`. These routers define the logic for processing incoming requests from the client and passing them to the core API via the `@xdatagroup/tbb-sdk/api` package.

##### Benefits of this Structure:

- **Security**: By using the backend as a proxy layer, the core API is protected from direct access, ensuring that only authenticated and authorized requests are processed.
- **Type-Safe API Requests**: The integration of `tRPC` ensures that all API requests between the client and backend are type-safe, minimizing runtime errors.
- **Session Handling**: The backend layer handles user sessions, ensuring that all requests to the core API are made in the context of the logged-in user.

### 3. **State Management**
- Feature-specific state (if required) should be in the `stores` directory within the respective feature.
- For shared state, use context API or a global store.

### 4. **Naming Conventions**
- **Components**: PascalCase (e.g., `ProfilePhotoSection.tsx`)
- **Functions and Hooks**: camelCase (e.g., `useProfileData`)
- **Types**: PascalCase with a `Type` suffix (e.g., `ProfileType`)

### 5. **Path Aliases**
- Use the `@` alias to simplify imports:
    - `@/components`: Shared components
    - `@/features`: Feature-based modules
    - `@/lib`: Utilities and libraries
    - `@/assets`: Global assets
    - `@/components/ui`: UI components from the UI Kit.
    - `@xdatagroup/tbb-sdk`: API client modules from the `tbb-sdk` package.

## 💻 Setup Instructions

### Development Mode

1. Clone the repository:
   ```bash
   git clone git@github.com:xdatagroup/comcora-web-app.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Production Mode (Using Docker)

To build and run the app in production mode using Docker, follow these steps:

1. Build the Docker image:
   ```sh
   docker build -t comcora-web-production . --build-arg NEXT_PUBLIC_BASE_URL=http://localhost:3000 --build-arg SESSION_SECRET=secret
   ```
    - **`--build-arg NEXT_PUBLIC_BASE_URL`**: This argument sets the base URL for the application. In this case, it's set to `http://localhost:3000` for local use.
    - **`--build-arg SESSION_SECRET`**: This argument sets the session secret used by the application.


2. Run the Docker container:
   ```sh
   docker run -p 3000:3000 comcora-web-production
   ```

   This will run the container and expose it on port 3000. You can access the application at `http://localhost:3000`.


3. View logs or troubleshoot (optional):
   ```sh
   docker logs <container_id>
   ```

   Replace `<container_id>` with the actual container ID from the `docker ps` command.

---

### 📝 Additional Notes:

- **Environment Variables**: The `NEXT_PUBLIC_BASE_URL` and `SESSION_SECRET` can be changed based on your environment and deployment requirements.
- **Docker**: This Docker setup assumes you have a working Docker installation. If not, please install [Docker](https://www.docker.com/) on your machine.

---

### Docker Benefits:

- **Consistency**: Ensures that the app runs in a consistent environment across different systems.
- **Simplified Deployment**: Docker helps in containerizing the app for deployment across different environments, including local, staging, and production.


## 🛠️ Tools and Libraries

- **[React](https://reactjs.org/)**: For building UI components.
- **[Next.js](https://nextjs.org/)**: For server-side rendering and routing.
- **[TypeScript](https://www.typescriptlang.org/)**: For static typing and improving code quality.
- **[react-hook-form](https://react-hook-form.com/)**: For form handling and validation.
- **[Zod](https://zod.dev/)**: For schema validation.
- **[shadcn](https://ui.shadcn.com/)**: For UI components.
- **[Tailwind CSS](https://tailwindcss.com/)**: For utility-first CSS styling.
- **[tRPC](https://trpc.io/)**: For building fully typesafe APIs between the client and server. Used for making **typesafe API requests** without needing to manually define REST endpoints. It simplifies client-server communication by sharing types between the frontend and backend.
    - Example usage:
      ```tsx
      import { trpc } from "@/lib/trpc";
      
      const { data, error } = trpc.user.getUserData.useQuery();
      ```
- **[TanStack Query (react-query)](https://tanstack.com/query/latest)**: For managing **server-state** in the frontend and handling asynchronous data fetching, caching, synchronization, and more.
    - It’s integrated with `tRPC` to manage the queries and mutations efficiently.
- **API Client (`@xdatagroup/tbb-sdk/*`)**: Custom API client for handling backend requests.

---

### Integration of `tRPC` and `TanStack Query`
- **tRPC** and **TanStack Query** are seamlessly integrated to allow **type-safe** and **reactive** data fetching from the backend. Together, they provide an efficient way to manage data flows between the server and client, with built-in type safety and optimized state management.
