package com.wherethe4cast.server.service;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class WeatherService {

    private static final String WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";
    private static final String AQI_BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
    private static final String GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
    private static final String REVERSE_GEO_BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

    private static final ParameterizedTypeReference<Map<String, Object>> MAP_TYPE = new ParameterizedTypeReference<>() {};

    private final RestClient restClient;

    public WeatherService() {
        this.restClient = RestClient.create();
    }

    public Map<String, Object> getWeatherData(double lat, double lon) {
        String weatherUrl = UriComponentsBuilder.fromUriString(WEATHER_BASE_URL)
                .queryParam("latitude", lat)
                .queryParam("longitude", lon)
                .queryParam("current", String.join(",",
                        "temperature_2m", "relative_humidity_2m", "apparent_temperature",
                        "precipitation", "weather_code", "wind_speed_10m", "wind_direction_10m",
                        "uv_index", "surface_pressure", "cloud_cover", "is_day"))
                .queryParam("hourly", String.join(",",
                        "temperature_2m", "relative_humidity_2m", "apparent_temperature",
                        "precipitation_probability", "precipitation", "weather_code",
                        "wind_speed_10m", "wind_direction_10m", "uv_index", "is_day"))
                .queryParam("daily", String.join(",",
                        "weather_code", "temperature_2m_max", "temperature_2m_min",
                        "apparent_temperature_max", "apparent_temperature_min",
                        "sunrise", "sunset", "uv_index_max",
                        "precipitation_sum", "precipitation_probability_max",
                        "wind_speed_10m_max", "wind_direction_10m_dominant"))
                .queryParam("forecast_days", 10)
                .queryParam("temperature_unit", "celsius")
                .queryParam("wind_speed_unit", "kmh")
                .queryParam("precipitation_unit", "mm")
                .queryParam("timezone", "auto")
                .toUriString();

        String aqiUrl = UriComponentsBuilder.fromUriString(AQI_BASE_URL)
                .queryParam("latitude", lat)
                .queryParam("longitude", lon)
                .queryParam("current", String.join(",",
                        "us_aqi", "pm10", "pm2_5", "carbon_monoxide",
                        "nitrogen_dioxide", "sulphur_dioxide", "ozone"))
                .queryParam("timezone", "auto")
                .toUriString();

        CompletableFuture<Map<String, Object>> weatherFuture = CompletableFuture.supplyAsync(
                () -> restClient.get().uri(weatherUrl).retrieve().body(MAP_TYPE));
        CompletableFuture<Map<String, Object>> aqiFuture = CompletableFuture.supplyAsync(
                () -> restClient.get().uri(aqiUrl).retrieve().body(MAP_TYPE));

        CompletableFuture.allOf(weatherFuture, aqiFuture).join();

        Map<String, Object> result = new HashMap<>(weatherFuture.join());
        Map<String, Object> aqiData = aqiFuture.join();
        if (aqiData != null && aqiData.containsKey("current")) {
            result.put("aqi", aqiData.get("current"));
        }
        return result;
    }

    public List<Object> searchCities(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        String url = UriComponentsBuilder.fromUriString(GEO_BASE_URL)
                .queryParam("name", query.trim())
                .queryParam("count", 6)
                .queryParam("language", "en")
                .queryParam("format", "json")
                .toUriString();

        Map<String, Object> response = restClient.get().uri(url).retrieve().body(MAP_TYPE);
        if (response == null || !response.containsKey("results")) {
            return List.of();
        }
        Object results = response.get("results");
        if (results instanceof List<?> list) {
            return List.copyOf(list);
        }
        return List.of();
    }

    public Map<String, Object> reverseGeocode(double lat, double lon, String lang) {
        String url = UriComponentsBuilder.fromUriString(REVERSE_GEO_BASE_URL)
                .queryParam("latitude", lat)
                .queryParam("longitude", lon)
                .queryParam("localityLanguage", (lang == null || lang.isBlank()) ? "vi" : lang)
                .toUriString();

        Map<String, Object> response = restClient.get().uri(url).retrieve().body(MAP_TYPE);
        return response != null ? response : Map.of();
    }
}
