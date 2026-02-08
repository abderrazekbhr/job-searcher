# Django Job Scraper & Application Manager

A comprehensive Django REST API application that automates job scraping from APEC (French job board), enriches job data using AI, and manages user applications with cover letter generation capabilities.

## 📋 Overview

This application provides an intelligent job search platform that:

- Scrapes job postings from APEC using Playwright
- Stores and manages job listings in a PostgreSQL database
- Uses Google Gemini AI to extract skills and generate job titles from CVs
- Generates personalized cover letters
- Manages user accounts with email confirmation
- Provides RESTful API endpoints with token-based authentication

## ✨ Features

### Job Scraping & Management

- **APEC Job Scraper**: Automated scraping of job postings with configurable filters (keywords, contract type, experience level)
- **Job Storage**: Persistent storage of job details including title, salary, location, skills, and company information
- **AI Skill Extraction**: Uses Gemini AI to analyze job descriptions and extract required skills
- **Cover Letter Generation**: Template-based cover letter creation with PDF CV parsing

### User Management

- **User Registration**: Account creation with email confirmation workflow
- **Token Authentication**: Secure REST API access using DRF token authentication
- **Profile Management**: User profiles with CV upload and job preferences
- **Email Notifications**: Automated confirmation emails via Gmail SMTP

### API & Documentation

- **OpenAPI/Swagger Documentation**: Interactive API documentation using drf-spectacular
- **RESTful Endpoints**: Well-structured API for users and job search operations
- **CORS Support**: Configurable cross-origin resource sharing
- **RESTful API**: Complete API documentation with Swagger UI
- **Containerized**: Easy deployment with Docker

## 🛠 Tech Stack

- **Backend**: Django 5.2.7
- **API Framework**: Django REST Framework 3.16.1
- **Documentation**: drf-yasg (Swagger/OpenAPI)
- **Web Scraping**: Playwright
- **AI Integration**: OpenAI GPT-3.5 Turbo
- **PDF Processing**: PyPDF
- **Database**: SQLite3
- **Containerization**: Docker

## 📋 Prerequisites

- Python 3.10+
- Docker (optional)
- OpenAI API key (or OpenRouter API key)

## 🚀 Quick Start

### Using Docker

1. Clone the repository:

   ```bash
   git clone https://github.com/abderrazekbhr/job-searcher.git
   cd django-app-scrapper
   ```

1. Create a .env file with your API keys:

   ```bash
   echo "API_KEY=your_openrouter_api_key" > .env
   ```

1. Build and run with Docker:

   ```bash
   docker build -t job-searcher .
   docker run -p 8000:8000 job-searcher
   ```

### Manual Setup

1. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

1. Install Playwright browsers:

   ```bash
   playwright install
   ```

1. Run migrations:

   ```bash
   cd scrapper
   python manage.py migrate
   ```

1. Start the development server:

   ```bash
   python manage.py runserver
   ```

## 📚 API Endpoints

- `GET /job-search/generate-job-titles/`: Generate job titles from CV
- `GET /job-search/apec-job-search/`: Search for jobs on APEC
- `GET /docs/`: Swagger UI API documentation

## 🔧 Configuration

The application uses environment variables for configuration:

- `API_KEY`: OpenRouter/OpenAI API key
- `DEBUG`: Enable/disable debug mode (default: True)
- `SECRET_KEY`: Django secret key
- `ALLOWED_HOSTS`: List of allowed hosts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Project Structure

```txt
django-app-scrapper/
├── scrapper/              # Main Django project directory
│   ├── JobSearch/        # Job search application
│   │   ├── migrations/   # Database migrations
│   │   ├── service.py    # Business logic and scraping functions
│   │   ├── views.py      # API views
│   │   └── urls.py       # URL routing
│   ├── config/           # Configuration files
│   │   └── generative_ia.py  # AI integration setup
│   ├── users/            # User management app
│   └── manage.py         # Django management script
├── requirements.txt      # Python dependencies
├── Dockerfile           # Docker configuration
└── README.md            # Project documentation
```

## ⚙️ Environment Setup

Create a `.env` file in the project root with the following variables:

```env
API_KEY=your_openrouter_api_key
DEBUG=True
SECRET_KEY=your-secret-key
```

## 🚨 Important Notes

- The application requires a valid OpenRouter or OpenAI API key
- Playwright runs in non-headless mode for development
- Default database is SQLite3 (can be changed in settings.py)
- Debug mode is enabled by default (disable in production)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- [ ] Add support for multiple job boards
- [ ] Implement user authentication
- [ ] Add job application tracking
- [ ] Implement email notifications
- [ ] Add resume parsing and scoring
- [ ] Support for more CV formats
- [ ] Advanced filtering options
