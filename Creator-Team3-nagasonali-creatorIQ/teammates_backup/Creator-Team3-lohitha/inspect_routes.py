import sys
from main import app

print("Registered Routes:")
for route in app.routes:
    print(f"Path: {route.path} | Methods: {route.methods} | Name: {route.name}")
