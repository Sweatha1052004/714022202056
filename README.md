# TinyURL
## Contents

- **LoggingMiddleware/**  
  Contains a reusable logging package that sends logs to the Affordmed test server API.  
  All significant events and errors in the application are logged using this middleware.

- **FrontendTestSubmission/**  
  Contains a React application for URL shortening and statistics.  
  - Allows shortening up to 5 URLs concurrently.
  - Supports custom shortcodes and validity periods.
  - Displays shortened URLs, expiry dates, and usage statistics.
  - Implements robust client-side validation and error handling.
  - Integrates the logging middleware throughout the codebase.
  - Uses Material UI for styling.


## How to Run

1. Install dependencies:
   ```
   cd FrontendTestSubmission
   npm install
   ```

2. Start the React app:
   ```
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

---
###**DEMO IMAGES**
<img width="1882" height="726" alt="Screenshot 2025-09-04 145654" src="https://github.com/user-attachments/assets/1f60cbf6-1fbc-451c-b0fe-012410001960" />
<img width="1886" height="769" alt="Screenshot 2025-09-04 145713" src="https://github.com/user-attachments/assets/a250fd11-aa43-4ffe-82ec-26f0c2cbda83" />
<img width="1735" height="763" alt="Screenshot 2025-09-04 145730" src="https://github.com/user-attachments/assets/2982878d-4385-48cc-8adf-2dc118cc05c3" />

## Notes

- All logging is performed via the custom Logging Middleware.
- No personal names or references to Affordmed are present in the repository name, README, or commit messages.
- Screenshots of API calls and application output are included in the
