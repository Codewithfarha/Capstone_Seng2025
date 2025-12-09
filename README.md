# Library Finder 

A platform to search, compare, and discover software libraries.

🔗 **Live:** https://library-finder-azure.vercel.app

## Features

- Search libraries with fuzzy matching and stats 
- Compare up to 4 libraries side-by-side and properties
- View detailed info with code examples
- User authentication (Email & Google)
- Submit feedback and reviews
- Fully responsive design


## Tech Stack

- **Frontend:** React, Tailwind CSS, Redux
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Hosting:** Vercel + Render

## Installation
```bash
# Clone repo
git clone https://github.com/Codewithfarha/Capstone_Seng2025.git

# Backend
cd backend
npm install
cp .env.example .env  # Add Firebase credentials
npm run dev

# Frontend
cd ../frontend
npm install
cp .env.example .env  # Add configuration
npm start
```

## Environment Setup

**Backend (.env)**
```
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## Status

✅ Search & Filter  
✅ Compare Libraries , properties and Code examples  
✅ Authentication  
✅ Feedback System  
✅ Favorites  
✅ Admin Panel 
✅ Search History 
✅ PDF Export 
✅ Stats and Filtering of it

## Links

- [Live Demo](https://library-finder-azure.vercel.app)
- [API](https://capstone-seng2025.onrender.com)
- [GitHub](https://github.com/Codewithfarha/Capstone_Seng2025)

## Author

Farhan Mohammed  
UMBC - Master of Software Engineering

## License

MIT