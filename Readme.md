# AGRO SCAN - AI Powered Plant Disease Detection Platform

A comprehensive Django-based platform for plant disease detection, weather-based forecasting, and community pest alerts.

## Features

- 🌿 **AI Disease Detection** - Upload plant images for instant disease diagnosis
- 🗺️ **Field Management** - Register and manage your agricultural fields
- 🌤️ **Weather Forecasting** - Predict disease risks based on weather conditions
- 🔔 **Alert System** - Receive and send pest/disease alerts to nearby farmers
- 📊 **Detection History** - Track all your past plant analyses
- 👤 **User Dashboard** - Comprehensive dashboard with sidebar navigation

## Tech Stack

- **Backend**: Django 5.0
- **Database**: SQLite (development) / PostgreSQL (production)
- **AI Model**: PyTorch CNN for plant disease classification
- **Frontend**: HTML5, CSS3, JavaScript

## Project Structure

```
Plant_diseases_Neha/
├── django_agroscan/          # Django project
│   ├── agroscan/             # Project settings
│   ├── core/                 # Main application
│   │   ├── models.py         # Database models
│   │   ├── views.py          # View functions
│   │   ├── urls.py           # URL routing
│   │   ├── forms.py          # Django forms
│   │   └── admin.py          # Admin configuration
│   ├── templates/            # HTML templates
│   ├── landing_page/         # Landing page assets
│   ├── static/               # Static files
│   ├── media/                # Uploaded files
│   └── manage.py
├── CNN.py                    # AI model definition
├── disease_info.csv          # Disease information database
├── supplement_info.csv       # Treatment recommendations
├── plant_disease_model_1_latest.pt  # Trained model weights
└── requirements.txt
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Plant_diseases_Neha
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Navigate to Django project**
   ```bash
   cd django_agroscan
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   - Main site: http://127.0.0.1:8000
   - Admin panel: http://127.0.0.1:8000/admin

## Usage

1. **Sign Up** - Create an account with your email
2. **Add Fields** - Register your farm field locations
3. **Detect Disease** - Upload plant images for AI analysis
4. **View Results** - Get disease info and treatment recommendations
5. **Report Pests** - Alert nearby farmers about pest sightings
6. **Check Forecasts** - View weather-based disease predictions

## API Endpoints

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login/` | User login |
| `/signup/` | User registration |
| `/dashboard/` | Main dashboard |
| `/detect/` | Disease detection |
| `/fields/` | Field management |
| `/history/` | Detection history |
| `/alerts/` | View alerts |
| `/forecast/` | Weather forecasting |
| `/report-pest/` | Report pest sighting |

## License

This project is for educational purposes.
