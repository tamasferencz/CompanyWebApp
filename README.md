<div align="center">

# 🏢 CompanyWebApp

**A modern Node.js REST API for company and address management**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

</div>

## ✨ Features

- 🏢 **Company Management** - Create, read, update, and delete companies
- 📍 **Address Management** - Manage company addresses with full CRUD operations
- 📚 **API Documentation** - Interactive Swagger UI documentation
- 🐳 **Docker Support** - Easy containerized deployment
- 🔗 **RESTful API** - Clean and intuitive API endpoints
- 📊 **Database Relations** - Companies with multiple addresses support

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- **Node.js** (version specified in `.nvmrc`)
- **Docker** (optional, for containerized setup)
- **MySQL** (if not using Docker)

### 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tamasferencz/CompanyWebApp
   cd CompanyWebApp
   ```

2. **Set up Node.js version**

   ```bash
   # Use the specified Node.js version
   nvm use
   ```

3. **Install dependencies**

   ```bash
   # If starting fresh
   npm init -y

   # Install required packages
   npm install mysql2 sequelize express swagger-ui-express swagger-jsdoc

   # Or if package.json exists
   npm install
   ```

## 🐳 Docker Setup

Get up and running with Docker in seconds!

```bash
# Start the application with Docker
docker compose up -d

# Stop the application
docker compose down -v
```

## 💻 Development

### Start the development server

```bash
# Start the backend server with hot reload
npm run dev
```

The server will start on `http://localhost:3000`

### 📖 API Documentation

Once the server is running, visit the interactive API documentation:

**🔗 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

## 🛠️ Tech Stack

| Technology     | Purpose             | Version    |
| -------------- | ------------------- | ---------- |
| **Node.js**    | Runtime Environment | Latest LTS |
| **Express.js** | Web Framework       | ^4.x       |
| **MySQL**      | Database            | ^8.x       |
| **Sequelize**  | ORM                 | ^6.x       |
| **Swagger**    | API Documentation   | ^3.x       |
| **Docker**     | Containerization    | Latest     |

## 🌟 API Endpoints

### Companies

- `POST /api/companies` - Create a new company
- `GET /api/companies` - Get all companies
- `GET /api/companies/{id}` - Get company by ID
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

### Addresses

- `POST /api/companies/{id}/addresses` - Add address to company
- `GET /api/companies/{id}/addresses` - Get company addresses
- `PUT /api/companies/{id}/addresses/{addressId}` - Update address
- `DELETE /api/companies/{id}/addresses/{addressId}` - Delete address

## 📚 Documentation & Resources

- 📖 [Sequelize Documentation](https://sequelize.org/docs/v6/getting-started/)
- 🔗 [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- 🐳 [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ and ☕**

⭐ Star this repo if you found it helpful!

</div>

