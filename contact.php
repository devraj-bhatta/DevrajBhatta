<?php
$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$subject = isset($_POST['subject']) ? $_POST['subject'] : '';
$message = isset($_POST['message']) ? $_POST['message'] : '';
if (!empty($name) && !empty($email) && !empty($subject) && !empty($message)) {
    $host = "localhost";
    $dbUsername = "root";
    $dbPassword = "";
    $dbname = "contact";


    $conn = new mysqli($host, $dbUsername, $dbPassword, $dbname);


    if ($conn->connect_error) {
        die('Connection Error (' . $conn->connect_errno . ') ' . $conn->connect_error);
    } else {
        $SELECT = "SELECT email FROM contact_info WHERE email = ? LIMIT 1";
        $INSERT = "INSERT INTO contact_info (name, email, subject, message) values (?, ?, ?, ?)";


        if ($stmt = $conn->prepare($SELECT)) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->bind_result($email);
            $stmt->store_result();
            $rnum = $stmt->num_rows;

            if ($rnum == 0) {
                $stmt->close();

                if ($stmt = $conn->prepare($INSERT)) {
                    $stmt->bind_param("ssss", $name, $email, $subject, $message);
                    $stmt->execute();
                    echo "New record inserted successfully";
                } else {
                    echo "Error preparing INSERT statement: " . $conn->error;
                }
            } else {
                echo "This email already exists";
            }
            $stmt->close();
        } else {
            echo "Error preparing SELECT statement: " . $conn->error;
        }
        $conn->close();
    }
} else {
    echo "All fields are required.";
}
?>