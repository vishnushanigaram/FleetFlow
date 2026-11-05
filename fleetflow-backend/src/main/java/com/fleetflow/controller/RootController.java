package com.fleetflow.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
public class RootController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String homeHtml() {
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FleetFlow API Server (MySQL)</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              background: #090d16; 
              color: #f1f5f9; 
              margin: 0; 
              padding: 40px 20px; 
              display: flex;
              justify-content: center;
            }
            .container { 
              background: #111827; 
              border: 1px solid #1f2937; 
              border-radius: 16px; 
              padding: 32px; 
              max-width: 760px; 
              width: 100%;
              box-shadow: 0 20px 40px rgba(0,0,0,0.6); 
            }
            .header { display: flex; align-items: center; justify-content: space-between; border-b: 1px solid #1f2937; padding-bottom: 20px; margin-bottom: 24px; }
            h1 { color: #38bdf8; margin: 0; font-size: 26px; display: flex; align-items: center; gap: 10px; }
            .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 12px; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3); }
            .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
            p { color: #94a3b8; line-height: 1.6; margin: 0 0 16px 0; font-size: 15px; }
            .btn-frontend { 
              display: inline-flex; 
              align-items: center; 
              gap: 8px; 
              background: #2563eb; 
              color: #ffffff; 
              padding: 12px 24px; 
              border-radius: 10px; 
              text-decoration: none; 
              font-weight: 600; 
              font-size: 14px;
              transition: all 0.2s;
              margin: 8px 0 24px 0;
            }
            .btn-frontend:hover { background: #1d4ed8; transform: translateY(-1px); }
            .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; }
            .endpoint-card { 
              background: #1f2937; 
              padding: 12px 16px; 
              border-radius: 8px; 
              text-decoration: none; 
              display: flex; 
              align-items: center; 
              justify-content: space-between;
              border: 1px solid #374151;
              transition: border-color 0.2s;
            }
            .endpoint-card:hover { border-color: #38bdf8; }
            .endpoint-card span.path { color: #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; font-weight: 500; }
            .endpoint-card span.method { background: #0284c7; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
            .meta-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 13px; color: #94a3b8; }
            .meta-box strong { color: #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 FleetFlow REST API</h1>
              <span class="badge"><span class="badge-dot"></span> Online & Serving</span>
            </div>

            <p>The Java Spring Boot backend is successfully running and connected to <strong>MySQL</strong>. This server provides enterprise REST APIs for vehicles, drivers, trips, dispatches, and telematics.</p>

            <a href="http://localhost:3000" class="btn-frontend">
              🖥️ Open FleetFlow React UI (http://localhost:3000)
            </a>

            <div class="meta-box">
              <div><strong>Database Engine:</strong> MySQL 8.x (<code>fleetflow_db</code>)</div>
              <div style="margin-top: 6px;"><strong>API Context:</strong> <code>/api/v1</code></div>
              <div style="margin-top: 6px;"><strong>Note:</strong> Opening this port directly serves API data. For the interactive user interface, launch the frontend with <code>npm run dev</code>.</div>
            </div>

            <h3 style="color: #cbd5e1; font-size: 15px; margin: 24px 0 12px 0;">Live REST Endpoints (Click to inspect JSON):</h3>
            <div class="card-grid">
              <a href="/api/v1/vehicles" class="endpoint-card" target="_blank">
                <span class="path">/api/v1/vehicles</span>
                <span class="method">GET</span>
              </a>
              <a href="/api/v1/drivers" class="endpoint-card" target="_blank">
                <span class="path">/api/v1/drivers</span>
                <span class="method">GET</span>
              </a>
              <a href="/api/v1/trips" class="endpoint-card" target="_blank">
                <span class="path">/api/v1/trips</span>
                <span class="method">GET</span>
              </a>
              <a href="/api/v1/deliveries" class="endpoint-card" target="_blank">
                <span class="path">/api/v1/deliveries</span>
                <span class="method">GET</span>
              </a>
              <a href="/api/v1/maintenance" class="endpoint-card" target="_blank">
                <span class="path">/api/v1/maintenance</span>
                <span class="method">GET</span>
              </a>
              <a href="/api/v1/fuel-records" class="endpoint-card" target="_blank">
                <span class="path">/api/v1/fuel-records</span>
                <span class="method">GET</span>
              </a>
              <a href="/api/v1/analytics/dashboard" class="endpoint-card" target="_blank">
                <span class="path">/api/v1/analytics/dashboard</span>
                <span class="method">GET</span>
              </a>
              <a href="/api/v1/notifications" class="endpoint-card" target="_blank">
                <span class="path">/api/v1/notifications</span>
                <span class="method">GET</span>
              </a>
            </div>
          </div>
        </body>
        </html>
        """;
    }

    @GetMapping(value = {"/api", "/api/v1"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> apiInfo() {
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status", "UP");
        resp.put("system", "FleetFlow Intelligent Logistics REST API");
        resp.put("version", "1.0.0");
        resp.put("database", "MySQL 8.x");
        resp.put("frontendUrl", "http://localhost:3000");
        resp.put("endpoints", Map.of(
            "vehicles", "/api/v1/vehicles",
            "drivers", "/api/v1/drivers",
            "trips", "/api/v1/trips",
            "deliveries", "/api/v1/deliveries",
            "maintenance", "/api/v1/maintenance",
            "fuel", "/api/v1/fuel-records",
            "analytics", "/api/v1/analytics/dashboard",
            "notifications", "/api/v1/notifications",
            "users", "/api/v1/auth/users"
        ));
        return ResponseEntity.ok(resp);
    }
}

