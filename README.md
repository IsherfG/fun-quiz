# FanQuiz Maker 🚀

![FanQuiz Maker Screenshot]<img width="1087" height="862" alt="Screenshot 2025-09-14 at 1 21 27 AM" src="https://github.com/user-attachments/assets/fe3e4aa7-8dba-4a82-b639-8abb6fdad485" />

<!-- **Action Required:** Upload your project screenshot to Imgur and paste the 'Direct Link' here -->

A full-stack, serverless web application that allows users to create, share, and play custom multiple-choice fan quizzes. This project was built from the ground up to be a polished, responsive, and feature-rich portfolio piece.

**Live Demo:** [**https://fun-quiz-beryl.vercel.app/**](https://fun-quiz-beryl.vercel.app/)

---

## Features ✨

*   **No-Code Quiz Creation:** An intuitive UI allows users to build quizzes without writing a single line of code.
*   **Dynamic Question Wizard:** Add, navigate, and edit questions one at a time in a clean, non-scrolling interface.
*   **Image Support:** Add an image URL to any question to create engaging, visual quizzes.
*   **Truly Shareable Quizzes:** All quizzes are saved to a central Firebase database, generating a unique URL that can be shared with anyone on the internet.
*   **Dual-Theme System:** Switch between a retro "Light" theme and a neon "Dark" theme. The user's preference is saved in their browser.
*   **Animated & Responsive Design:** The UI is fully responsive for mobile, tablet, and desktop, and features a subtle, theme-aware animated background.
*   **Polished UX:** Includes a "Start Quiz" screen, a professional footer, and helpful UI states for loading and saving.

---

## Tech Stack 🛠️

This project showcases a modern, full-stack serverless architecture.

*   **Frontend:**
    *   **Framework:** React (with Vite)
    *   **Routing:** React Router
    *   **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
    *   **Styling:** Pure CSS with CSS Variables for themeing, and Media Queries for responsiveness.

*   **Backend & Database:**
    *   **Database:** Google Firestore (NoSQL)
    *   **Backend Service:** Firebase (for database interaction)
    *   **Hosting:** Vercel

---

## Key Technical Decisions & Learnings

Building this project involved several key architectural decisions:

1.  **Initial State Management (`localStorage`):** The project was initially prototyped using the browser's `localStorage`. This was a fast and effective way to build the core UI, but I quickly identified its main limitation: quizzes were not shareable.

2.  **Migration to a Serverless Backend (Firebase):** To solve the shareability problem, I migrated the data persistence layer to Firebase.
    *   I designed a simple but effective NoSQL schema in **Firestore** to store the quiz data.
    *   I configured **Security Rules** to allow anyone to create and read quizzes, while preventing unauthorized updates or deletions, a crucial security consideration.
    *   I refactored the component logic to handle **asynchronous API calls** for saving and fetching data, including managing loading, error, and success states.

3.  **Theming with CSS Variables & React Context:** To implement the theme-switcher, I used the React Context API to manage the global theme state. This state toggles a `data-theme` attribute on the `<body>`, which in turn activates a different set of CSS variables. This approach is highly efficient and scalable, allowing the entire app's look and feel to be changed without component re-renders.

---

## How to Run Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v16 or later)
*   npm

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/IsherfG/fun-quiz.git
    cd fanquiz-maker
    ```
    <!-- **Action Required:** Replace this with your actual repository URL -->

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your Firebase environment:**
    *   You will need to create your own free project on [Firebase](https://firebase.google.com/).
    *   Enable the **Firestore Database**.
    *   In the project's root directory, create a new file named `.env.local`.
    *   Copy your Firebase web app configuration keys into the `.env.local` file. They must be prefixed with `VITE_`:
      ```      VITE_FIREBASE_API_KEY="your-key"
      VITE_FIREBASE_AUTH_DOMAIN="your-domain"
      VITE_FIREBASE_PROJECT_ID="your-project-id"
      # ... and so on for all keys
      ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

---

## Contact

Isherf - [@IsherfG](https://twitter.com/IsherfG) - isherftheg@gmail.com

Project Link: [https://github.com/IsherfG/fun-quiz](https://github.com/IsherfG/fun-quiz)
<!-- **Action Required:** Replace all placeholder contact info -->
