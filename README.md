# Quiz Maker 🚀

<img width="1087" height="862" alt="A screenshot of the Quiz Maker application showing the quiz creation interface in light mode." src="https://github.com/user-attachments/assets/fe3e4aa7-8dba-4a82-b639-8abb6fdad485" />

A full-stack, serverless web application that allows users to create, share, and play custom multiple-choice quizzes. This project was built from the ground up to be a polished, responsive, and feature-rich portfolio piece.

**Live Demo:** [**https://fun-quiz-beryl.vercel.app/**](https://fun-quiz-beryl.vercel.app/)

---

## Features ✨

This project is packed with features designed to provide a complete and satisfying experience for both quiz creators and players.

### For Quiz Creators:
*   **Intuitive Quiz Builder:** A clean UI allows users to build quizzes without writing a single line of code.
*   **Dynamic Question Wizard:** Add, navigate, and edit questions one at a time in a non-scrolling interface.
*   **Delete Question Support:** Easily remove unwanted questions with a confirmation step to prevent mistakes.
*   **Image Support:** Add an image URL to any question to create engaging, visual quizzes.
*   **Configurable Retakes:** Creators can choose whether a quiz can be taken multiple times or only once per user (tracked via browser storage).

### For Quiz Takers:
*   **Truly Shareable Quizzes:** All quizzes are saved to a central Firebase database, generating a unique URL that can be shared with anyone on the internet.
*   **One-Time-Only Logic:** For quizzes where retakes are disabled, the app prevents a user from retaking it to ensure a fair challenge.
*   **Multi-Page PDF Export:** After completing a quiz, users can export a clean, multi-page PDF of their results, showing every question, their answer, and the correct answer.

### General & UX Features:
*   **Dual-Theme System:** Switch between a retro "Light" theme and a neon "Dark" theme. The user's preference is saved in their browser for future visits.
*   **Animated & Responsive Design:** The UI is fully responsive for mobile, tablet, and desktop, and features a subtle, theme-aware retro grid background.
*   **Polished User Experience:** Includes a "Start Quiz" screen, a professional footer, and helpful UI states for loading, saving, and exporting.

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

*   **Key Libraries:**
    *   **jsPDF:** For native, client-side PDF generation.

---

## Key Technical Decisions & Learnings

Building this project involved several key architectural decisions:

1.  **Initial State Management (`localStorage`):** The project was initially prototyped using the browser's `localStorage`. This was a fast and effective way to build the core UI, but I quickly identified its main limitation: quizzes were not shareable.

2.  **Migration to a Serverless Backend (Firebase):** To solve the shareability problem, I migrated the data persistence layer to Firebase. I designed a simple but effective NoSQL schema in **Firestore** and configured **Security Rules** to allow public creation and reads while preventing unauthorized writes.

3.  **Client-Side PDF Generation:** To implement the results export feature, I initially considered a simple "screenshot" library (`html2canvas`). I discovered this approach failed for long quizzes that spanned multiple pages. I pivoted to a more robust solution, using **jsPDF** to programmatically build the document from scratch, giving me full control over layout, styling, and multi-page functionality.

4.  **Theming with CSS Variables & React Context:** To implement the theme-switcher, I used the React Context API to manage the global theme state. This state toggles a `data-theme` attribute on the `<body>`, which in turn activates a different set of CSS variables. This approach is highly efficient and scalable.

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
    cd fun-quiz
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your Firebase environment:**
    *   You will need to create your own free project on [Firebase](https://firebase.google.com/).
    *   Enable the **Firestore Database**.
    *   In the project's root directory, create a new file named `.env.local`.
    *   Copy your Firebase web app configuration keys into the `.env.local` file. They must be prefixed with `VITE_`:
      ```
      VITE_FIREBASE_API_KEY="your-key"
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
