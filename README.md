# Wikidata Explorer

A full-stack application to search and explore entities from Wikidata.

- 🌐 Frontend: Angular
- 🐍 Backend: Python (FastAPI)
- Wikidata SPARQL query
- 🚀 Auto-setup scripts provided for Linux/macOS (`build-and-run.sh`) and Windows (`build-and-run.bat`)

---

## 📂 Project Structure

```
wikidata-explorer/
├── backend/
│   └── app/
│       ├── main.py
│       ├── models.py
│       ├── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   └── styles.css
│   └── angular.json
├── build.sh
├── build.bat
├── README.md
└── .gitignore
```

---

## 🧩 Architecture Diagram

```plaintext
+----------------+                 +-----------------------+                 +------------------------+
|                |  HTTP Request   |                       | SPARQL Query    |                        |
|  User Browser  +---------------->+  FastAPI Backend API  +---------------->+  Wikidata SPARQL       |
|   Angular      |                 |  /api/search          |                 |  Endpoint              |
+----------------+                 |  /api/entity/{id}     |                 |  (query.wikidata.org)  |
                                   |                       |<----------------+                        |
                                   |                       |  JSON Response  +------------------------+
                                   +----------+------------+
                                             |
                                             |
                                   +---------v----------+
                                   |                    |
                                   |   JSON Response    |
                                   | (structured data)  |
                                   +---------+----------+
                                             |
                           +-----------------v------------------+
                           |                                    |
                           |         Frontend Renders           |
                           |    - Search result list            |
                           |    - Entity details with labels    |
                           |    - Properties and values         |
                           +------------------------------------+
                    
---

## ⚙️ Requirements

Before running, make sure you have:

| Software    | Minimum Version | Notes                                                  |
|:------------|:------------------|:-----------------------------------------------------|
| Python      | 3.11              | [Download Python](https://www.python.org/downloads/) |
| Node.js     | 18+               | [Download Node.js](https://nodejs.org/)              |
| npm         | 9+                | Installed with Node.js                               |
| Angular CLI | Latest            | Installed via `npm install -g @angular/cli`          |

---

## 🚀 Setup and Run Instructions

### 🔵 On Linux/macOS

1. Open a terminal
2. Clone or unzip the project
3. Navigate to the project directory:

   ```bash
   cd wikidata-explorer
   ```

4. Make the script executable (only once):

   ```bash
   chmod +x build.sh
   ```

5. Run the script:

   ```bash
   ./build.sh
   ```

This will:
- Check for Python 3.11, Node.js, Angular CLI
- Set up backend and frontend automatically
- Start both servers

---

### 🟠 On Windows

1. Open Command Prompt
2. Navigate to the project directory:

   ```bat
   cd path\to\wikidata-explorer
   ```

3. Run:

   ```bat
   build.bat
   ```

This will:
- Check for Python 3.11, Node.js, Angular CLI
- Set up backend and frontend automatically
- Start both servers

---

## 🌐 How to Access

- Frontend Angular App: [http://localhost:4200]
- Backend Python API: [http://localhost:5000]
