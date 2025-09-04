#**TinyURL**
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

## Notes

- All logging is performed via the custom Logging Middleware.
- No personal names or references to Affordmed are present in the repository name, README, or commit messages.
- Screenshots of API calls and application output are included in the
