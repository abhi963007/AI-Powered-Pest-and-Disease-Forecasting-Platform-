const axios = require('axios');

const DISEASE_RULES = [
    {
        name: "Powdery Mildew",
        crops: ["Tomato", "Pepper", "Squash", "Cucumber", "Grapes"],
        conditions: { humidity_min: 60, humidity_max: 80, temp_min: 15, temp_max: 27 },
        reason_template: "Moderate humidity ({humidity}%) and warm temperatures ({temp}°C) favor spore germination",
        prevention: ["Ensure good air circulation", "Avoid overhead watering", "Apply sulfur fungicides"]
    },
    {
        name: "Late Blight",
        crops: ["Tomato", "Potato"],
        conditions: { humidity_min: 75, humidity_max: 100, temp_min: 10, temp_max: 25, rain_required: true },
        reason_template: "Cool, wet conditions ({temp}°C, {humidity}% humidity) are ideal for Late Blight",
        prevention: ["Use resistant varieties", "Apply copper fungicides", "Improve drainage"]
    }
    // More rules can be added here (mirroring the python service)
];

const getWeatherData = async (lat, lon, apiKey) => {
    if (!apiKey) return {
        temperature: 28, humidity: 75, condition: "Clear", description: "Demo Mode",
        wind_speed: 3.5, rain_chance: 30, icon: "01d", location_name: "Demo Location"
    };

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const res = await axios.get(url);
        const data = res.data;
        return {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            wind_speed: data.wind.speed,
            rain_chance: data.clouds.all,
            icon: data.weather[0].icon,
            location_name: data.name
        };
    } catch (e) {
        console.error('Weather API error:', e);
        return null;
    }
};

const calculateDiseaseRisk = (weather, userCrops = null) => {
    const forecasts = [];
    DISEASE_RULES.forEach(rule => {
        const cond = rule.conditions;
        const tempMatch = weather.temperature >= cond.temp_min && weather.temperature <= cond.temp_max;
        const humidityMatch = weather.humidity >= cond.humidity_min && weather.humidity <= cond.humidity_max;

        let riskScore = 10;
        if (tempMatch && humidityMatch) riskScore = 80;
        else if (tempMatch || humidityMatch) riskScore = 40;

        let riskLevel = 'low';
        if (riskScore >= 70) riskLevel = 'high';
        else if (riskScore >= 40) riskLevel = 'medium';

        forecasts.push({
            name: rule.name,
            risk_level: riskLevel,
            risk_score: riskScore,
            reason: rule.reason_template.replace('{temp}', weather.temperature).replace('{humidity}', weather.humidity),
            prevention: rule.prevention,
            crops: rule.crops
        });
    });
    return forecasts.sort((a, b) => b.risk_score - a.risk_score);
};

module.exports = { getWeatherData, calculateDiseaseRisk };
