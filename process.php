<?php
// Database connection details
$host = "localhost";
$username = "root"; // Default XAMPP username
$password = "devraj"; // Default XAMPP password (leave blank)
$dbname = "contact_form";

// Establish database connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = $conn->real_escape_string($_POST["name"]);
    $email = $conn->real_escape_string($_POST["email"]);
    $subject = $conn->real_escape_string($_POST["subject"]);
    $message = $conn->real_escape_string($_POST["message"]);

    // Prepare the SQL statement
    $stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $subject, $message);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        echo "<h3 style='color: green; text-align: center;'>Message sent successfully. Thank you!</h3>";
    } else {
        echo "<h3 style='color: red; text-align: center;'>Error: " . $stmt->error . "</h3>";
    }

    // Close the statement
    $stmt->close();
}

// Close the database connection
$conn->close();
?>
