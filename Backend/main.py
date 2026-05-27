import asyncio
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import psutil

app = FastAPI()

# Allow your React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your specific Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration Thresholds
CPU_THRESHOLD = 85.0
RAM_THRESHOLD = 90.0

@app.websocket("/ws/stats")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Frontend client connected to WebSocket.")
    try:
        while True:
            # 1. Gather real hardware stats
            cpu_usage = psutil.cpu_percent(interval=None) # Non-blocking
            ram = psutil.virtual_memory()
            ram_usage = ram.percent
            
            # Network speeds (bytes sent/received since boot)
            net_io = psutil.net_io_counters()
            bytes_total = (net_io.bytes_sent + net_io.bytes_recv) / 1024 # KB
            
            # 2. Check Threshold Breaches & Determine Status
            is_error = False
            alert_message = None
            
            if cpu_usage > CPU_THRESHOLD:
                is_error = True
                alert_message = f"CRITICAL: High CPU Usage ({cpu_usage}%)"
            elif ram_usage > RAM_THRESHOLD:
                is_error = True
                alert_message = f"CRITICAL: High RAM Usage ({ram_usage}%)"

            # 3. Package Payload
            payload = {
                "timestamp": time.strftime("%H:%M:%S"),
                "cpu": cpu_usage,
                "ram": ram_usage,
                "network": round(bytes_total, 1),
                "has_alert": is_error,
                "alert_text": alert_message
            }
            
            # 4. Stream to Frontend
            await websocket.send_json(payload)
            
            # Stream update frequency (e.g., every 1 second)
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        print("Frontend client disconnected.")