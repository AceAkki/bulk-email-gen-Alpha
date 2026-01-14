# 📧 Bulk Mailer Gen - Alpha

A specialized **JavaScript automation engine** designed to bridge the gap between raw event data and personalized marketing assets. This tool eliminates manual HTML editing by programmatically "hydrating" templates with localized event details, generating platform-ready mailers for both CRM systems and static web hosting.

---

## 🛠️ Technical Architecture

This project is built using a **Modular Class-Based Architecture**, focusing on high-performance DOM manipulation and data parsing without external dependencies.

* **Data Hydration Engine:** Automatically parses complex JSON objects (Cities, Venues, Timestamps) and injects values into specific HTML targets.
* **Intelligent Date Formatting:** Utilizes a custom helper class to transform human-readable strings into **ISO 8601** format for system compatibility.
* **Dual-Platform Rendering:** A built-in mapping system allows for toggling between:
    * **Merge-Tag Mode:** For CRMs like Mailchimp or Salesforce.
    * **Normal Mode:** For direct server hosting and browser viewing.
* **GCal Integration:** Programmatically generates Google Calendar `TEMPLATE` links with encoded metadata (Location, Description, and localized Timezones).

---

## 🚀 Key Features

* **Bulk Processing:** Iterates through city/country datasets to generate multiple localized versions of a single template in one execution.
* **Regex-Powered Utilities:** Advanced string manipulation to clean and format dates/times for Google Calendar URL integration.
* **Dependency Injection:** Designed for scalability by passing configuration objects into the class constructor, making it reusable across different event types.
* **Dynamic Link Mapping:** Automatically updates registration and archive links based on the specific city or platform requirements.

---

## 💻 Code Highlight: Dynamic Mapping

Instead of brittle `if/else` chains, the system uses a **Map object** to handle platform logic, ensuring the code is declarative and easy to maintain.
