<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
<div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border: 1px solid #ddd;">
    <!-- Header Section -->
    <div style="text-align: center; margin-top: 5%;">
        <img src="{{ $message->embed(public_path('images/logo.png')) }}"
             alt="HealthCare App Logo"
             style="width: 50%; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
    </div>

    <!-- Content Section -->
    <div style="padding: 20px;">
        <p style="margin: 10px 0; line-height: 1.6;">Hello,</p>
        <p style="margin: 10px 0; line-height: 1.6;">Your OTP code is:</p>
        <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; color: #26449f; font-weight: bold;">{{ $otp }}</span>
        </div>
        <p style="margin: 10px 0; line-height: 1.6;">This code is valid for <strong>3 minutes</strong>. Please do not share it with anyone for security purposes.</p>
        <p style="margin: 10px 0; line-height: 1.6;">Thank you for using HealthCare App!</p>
    </div>
    <!-- Footer Section -->
    <div style="text-align: center; font-size: 12px; color: #777777; padding: 10px; background: #f4f4f9;">
        &copy; 2025 HealthCare App. All rights reserved.
    </div>
</div>
</body>
</html>
