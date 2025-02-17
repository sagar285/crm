# 🚀 My Next.js App

This is a **Next.js** application integrated with **Prisma** for database management.

## 📌 Features

- 🔥 Next.js for fast rendering
- 🗄️ Prisma for database interaction with postgresql
- 🔐 Authentication (if applicable)
- 🎨 Tailwind CSS (if used)
- ⚡ Optimized API routes

---

## 🛠️ Installation & Setup

Follow these steps to set up the project on your local machine:

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/sagar285/crm.git
cd crm

npm install 

##  make connection with db 
npx prisma generate 

## to setup model into db
npx prisma db push 

### to run this project
npm run dev 


## 📜 API Endpoints


# signup and login routes

  POST /api/auth/register  --- create a new user

  SIGNIN Next-AUTH sign in setup


#  plugin routes 

 POST /api/plugins  --- create a new plugin

 GET /api/plugins -- get all plugins

 PUT /api/plugins/id -- update plugin

 DELETE /api/plugins/id   -- delete plugin


#  install plugin 

 GET /api/user/plugins  --- all user installed plugins

 POST /api/plugins --  user installed plugins

#  post routes

 POST /api/posts  --- create a new plugin

 GET /api/posts -- get all plugins

 PUT /api/posts/id -- update plugin

 DELETE /api/posts/id   -- delete plugin


# add plugin in post 


 POST /api/posts/plugins/id   -- to add plugin in an post

















