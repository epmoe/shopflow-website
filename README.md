# shopflow-website
# ShopFlow – CISS 340 Database Project

## 1. Project Purpose

The purpose of ShopFlow is to demonstrate the creation, management, and analysis of a relational database for a fictional e-commerce business. The project involves importing and cleaning data, creating relationships between tables, performing SQL queries, and displaying selected database information through a live website.

All data used in this project is realistic, instructor-provided fictional data.

**Live Website:** https://shopflow-website.netlify.app

## 2. System Architecture and Data Flow

The website is hosted on Netlify, while the MySQL database is hosted on Aiven.

**Data flow:**

Browser → Netlify Page → Netlify Function/API → Aiven MySQL → JSON → Browser

When a user interacts with the website, JavaScript sends a request to a Netlify Function. The function connects to the MySQL database, executes a SQL query, and returns the results in JSON format. The website then displays the returned information to the user.

This allows users to retrieve information from the database without directly connecting to it or having access to database credentials.

## 3. Database Tables and Relationships

The database contains seven tables with a combined total of 144 records.

| Table | Records | Description |
|---|---:|---|
| customers | 20 | Customer information |
| products | 20 | Product and inventory information |
| orders | 20 | Customer orders |
| order_items | 49 | Individual products within orders |
| reviews | 15 | Customer product reviews |
| abandoned_carts | 10 | Abandoned shopping carts |
| support_tickets | 10 | Customer support requests |

The `product_reviews.csv` file was imported into the `reviews` table.

Primary and foreign keys establish the following one-to-many relationships:

- Customers to orders
- Customers to reviews
- Customers to abandoned carts
- Customers to support tickets
- Orders to order items
- Orders to support tickets
- Products to order items
- Products to reviews

The `order_items` table acts as a bridge between the `orders` and `products` tables, allowing multiple products to be associated with multiple orders.

The database used in this implementation is named `defaultdb`.

## 4. Data Cleaning and Validation

The instructor-provided CSV files were processed using Python in Google Colab before being imported into MySQL. Data cleaning was necessary to ensure that the information was compatible with the database schema and could be used accurately in SQL queries.

[Describe the specific data cleaning operations performed in the notebook.]

After importing the data, record counts were checked to confirm that all seven tables were populated successfully. Primary keys, foreign keys, data types, and constraints help maintain the integrity of the database.

For revenue calculations in the notebook, only orders with a status of `Delivered` were considered completed sales. Revenue was calculated using product quantities and unit prices.

## 5. Website Queries and Verification

The website provides the following functionality:

- Browsing active products
- Searching for products
- Filtering products by category and price
- Looking up fictional customers by email
- Viewing top-performing products
- Analyzing customer segments
- Viewing revenue analysis
- Viewing order status distributions

The product browsing, search, filtering, and business analytics features were tested successfully on the deployed website.

Website results are validated by comparing them with the results of equivalent SQL queries in the Google Colab notebook.

[Include the results of the completed notebook-to-website comparisons.]

The Google Colab notebook is the complete analytics deliverable and contains all ten required SQL queries and five interactive visualizations. The website serves as a focused demonstration of selected database queries.

## 6. Database Security and Access Control

The `avnadmin` account is used for administrative tasks such as creating tables, importing data, and configuring database permissions.

The website uses the `shopflow_reader` account instead. This account has `SELECT` permissions, which allow it to retrieve information without granting it permission to modify or delete records.

This follows the principle of least privilege because the website only receives the permissions necessary for its intended functionality.

Database credentials are stored in server-side environment variables rather than being hard-coded into the website.

TLS certificate verification is enabled for connections between Netlify and Aiven. During deployment, certificate formatting issues were resolved by Base64-encoding the CA certificate and decoding it within the Netlify Functions. This preserves the certificate's formatting without disabling certificate verification.

## 7. Setup and Testing Instructions

### Setup

1. Clone the GitHub repository.
2. Install Node.js and the required dependencies using `npm install`.
3. Create a local `.env` file using `.env.example` as a template.
4. Configure the required environment variables.
5. Connect the GitHub repository to Netlify.
6. Configure the same environment variables in Netlify.
7. Deploy the website.

### Environment Variables

The following values are placeholders only.

| Variable | Placeholder |
|---|---|
| DB_HOST | your-database-host |
| DB_PORT | your-database-port |
| DB_USER | shopflow_reader |
| DB_PASSWORD | your-reader-password |
| DB_NAME | your-database-name |
| DB_CA_CERT | your-base64-encoded-ca-certificate |

The CA certificate must be Base64-encoded before being stored in the environment variable.

The website uses `/.netlify/functions` as its relative API base path.

Actual credentials, certificates, connection strings, and populated `.env` files must not be uploaded to GitHub.

### Testing

The following procedures are used to test the website:

- Confirm that products load from the database.
- Test product searches and filters.
- Test customer lookup using fictional email addresses.
- Execute all four business analytics queries.
- Compare website results against notebook results.
- Inspect API responses using browser developer tools.
- Test empty results and invalid inputs.
- Confirm that `shopflow_reader` can execute SELECT queries but cannot perform write operations.
- Confirm that the website is publicly accessible using a private browser window.
