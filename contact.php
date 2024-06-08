<?php
	$name = $_POST['name'];
	$email = $_POST['email'];
	$subject = $_POST['subject'];
	$message = $_POST['message'];

	if (!empty($name) || !empty($email) || !empty($subject)) {
		$host = "localhost";
		$dbUsername = "root";
		$dbPassword = "";
		$dbName = "contact";

		//Creating a connection
		$conn = new mysqli($host, $dbUsername, $dbPassword, $dbName);
		if(mysqli_connect_error()) {
			die('Connection Error('. mysqli_connect_error().')'. mysqli_connect_error());
		} else {
			$SELECT = "SELECT email FROM contact_info WHERE email = ? LIMIT 1";
			$INSERT = "INSERT INTO contact_info (name, email, subject, message) values (?, ?, ?, ?)";

			//Prepare Statement
			$stmt = $conn->prepare($SELECT);
			$stmt->$bind_param("s", $email);
			$stmt->execute();
			$stmt->bind_result($email);
			$stmt->store_result();
			$rnum = $stmt->num_rows;
			
			if($rnum==0) {
				$stmt->close();

				$stmt = $conn->prepare($INSERT);
				$ismt->bind_param("ssss", $name, $email, $subject, $message);
				$stmt->execute();
				echo "New record inserted successfully";
			} else {
				echo "Already exists this email";
			}
			$stmt->close();
			$conn->close();

		}

	}else {
		echo "All field are required.";
		die();
	}
?>