package com.wherethe4cast.server.controller;

import com.wherethe4cast.server.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/weather")
    public ResponseEntity<Map<String, Object>> getWeather(
            @RequestParam double lat,
            @RequestParam double lon) {
        return ResponseEntity.ok(weatherService.getWeatherData(lat, lon));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Object>> searchCities(@RequestParam String q) {
        return ResponseEntity.ok(weatherService.searchCities(q));
    }

    @GetMapping("/geocode/reverse")
    public ResponseEntity<Map<String, Object>> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "vi") String lang) {
        return ResponseEntity.ok(weatherService.reverseGeocode(lat, lon, lang));
    }
}
