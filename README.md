# 🌍 Disaster Connect — Crowdsourced Emergency Response Platform

![Disaster Connect Banner](assests/Disaster.png)

Disaster Connect is a **real-time, crowdsourced emergency reporting platform** that empowers citizens to submit incidents with geo-tagged photos, live location, and disaster details — helping communities stay informed and enabling faster response.

Users can report incidents from anywhere in India, explore disasters via an interactive map, and filter updates using a notification radius (e.g., 5 km, 10 km, 50 km) to avoid alert fatigue.

This platform demonstrates **real-world disaster management capabilities** including geolocation, mapping, geo-based filtering, incident analytics, and intuitive UI design.

---

# 🚨 Key Features

### 🆘 **Live Disaster Reporting**

* Multi-step reporting form with:

  * Incident type
  * Severity level
  * Description
  * Geo-tagged location
  * Image upload (preview supported)

### 🗺️ **Interactive Disaster Map (Leaflet + OSM)**

* Real-time incident markers
* Severity-colored markers (High/Medium/Low)
* Hover to preview incident details
* Click markers to view full report info

### 📍 **Location Selection**

* Users can click directly on the map to pick a custom disaster location

### 📡 **Geo-Targeted Notifications**

* Set radius (5–50 km)
* Receive only nearby incident updates
* Avoid alert fatigue

### 📄 **Incident Feed**

* Live feed of all reported incidents
* Search by type or severity
* Sort by newest/oldest
* Integrated distance calculation (Haversine formula)

### 🌙 **Modern UI / UX**

* Tailwind CSS + shadcn-ui components
* Mobile-friendly responsive layout
* Dark theme optimized

---

# 🧰 Tech Stack

### **Frontend**

* React (Vite)
* TypeScript
* Tailwind CSS
* shadcn UI
* Zustand (state management)
* Leaflet + OpenStreetMap (maps)
* Vite environment variables

### **Backend (Optional / Planned)**

*(Not currently active to keep AWS free-tier deployment simple)*

* Node.js
* Express
* MongoDB (planned integration)
* S3 Presigned Uploads (planned)

### **Deployment**

* **AWS S3 + CloudFront** (Production)
* **GitHub** (Codebase)
* **Free AWS Tier** compliant (no charges)

---

# 🛠️ Installation & Local Setup

### 🔧 Prerequisites

* Node.js 16+
* npm or yarn
* Git
* (Optional) MongoDB Atlas cluster for backend expansion

---

## 🔹 Clone & Run Locally

```sh
# Step 1 — Clone repository
git clone <YOUR_REPOSITORY_URL>

cd disaster-connect

# Step 2 — Install dependencies
npm install

# Step 3 — Start development server
npm run dev

# The app will run at http://localhost:5173
```

---

# ⚙️ Environment Variables (Optional)

Create a `.env` file in project root:

```env
# If backend enabled later
VITE_API_URL=http://localhost:5000/api
```

> If `VITE_API_URL` is **not** set, the app automatically uses India-based demo incidents.

---

# 🚀 Deployment (AWS S3 + CloudFront) — Fully Manual, Free Tier

### **1. Build frontend**

```sh
npm run build
```

### **2. Upload to S3**

* Create an S3 bucket
* Disable “Block all public access”
* Enable Static Website Hosting → index.html, error.html
* Upload `/dist` files

### **3. Bucket Policy**

```json
{
  "Version": "2012-10-17",
  "Statement":[{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
  }]
}
```

### **4. Create CloudFront Distribution**

* Origin = your S3 Website Endpoint
* Viewer Protocol Policy = Redirect HTTP → HTTPS
* Default root object = index.html
* Error overrides:

  * 403 → `/index.html` (200)
  * 404 → `/index.html` (200)

### **5. Access your live site**

CloudFront gives you:

```
https://d123abcd1234.cloudfront.net
```

### **6. Updating the site**

```sh
aws s3 sync dist s3://YOUR_BUCKET_NAME --acl public-read
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

---

# 📌 Project Structure

```
src/
 ├── components/
 ├── pages/
 ├── lib/
 │   ├── store.ts      # Zustand store
 │   ├── utils.ts      # helper utils
 ├── assets/
 │   └── Disaster.png
 ├── App.tsx
 ├── main.tsx
public/
dist/
backend/  (optional future API)
```

---

# 📈 Future Enhancements (Planned)

### 🔹 MongoDB-backed Incident Storage

### 🔹 S3 Presigned Image Uploads

### 🔹 Admin Dashboard

### 🔹 Real-time updates via WebSockets

### 🔹 Push Notifications

### 🔹 Heatmaps & Severity Clusters

### 🔹 AI-based Disaster Type Classification

---

# 🤝 Contributing

Contributions are welcome!

1. Fork repo
2. Create feature branch
3. Commit changes
4. Create PR

---

# 📧 Contact

**Abhishek Yadav**
📩 Email: **[2516abhi43@gmail.com](mailto:2516abhi43@gmail.com)**
🌐 Portfolio (optional): *Add link here*

---

# ⭐ If you like this project

Give it a ⭐ on GitHub — it motivates and helps visibility!
