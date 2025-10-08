# Article-api
Installation

Clone the repository:

git clone https://github.com/yourusername/article-api.git
cd article-api


Install dependencies:

npm install


Create a .env file in the root:

PORT=4000
DATABASE_URL=postgresql://username:password@localhost:5432/article_api
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password


Start the server:

npm run dev


The server will start at http://localhost:4000.

Database Setup

Users Table

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Articles Table

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Comments Table

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

API Endpoints

User Routes

Method	Endpoint	Description	Body

POST	/api/users/register	Register a new user (OTP sent via email)	{ username, email, password }
POST	/api/users/verify-otp	Verify OTP to activate account	{ email, otp }
POST	/api/users/login	Login user and get JWT	{ email, password }

Article Routes

Method	Endpoint	Description	Protected

GET	/api/articles	Get all articles (public)	No
GET	/api/articles/:id	Get article by ID with comments	No
POST	/api/articles	Create a new article	Yes
PUT	/api/articles/:id	Update your own article	Yes
DELETE	/api/articles/:id	Delete your own article	Yes

Comment Routes

Method	Endpoint	Description	Protected

POST	/api/articles/:id/comments	Add a comment to an article	Yes
DELETE	/api/articles/:article_id/comments/:comment_id	Delete your own comment	Yes
