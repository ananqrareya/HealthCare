<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Book Appointment</title>
</head>
<body>
<h1>Book Appointment</h1>
<form action="{{route('get.csrf.token')}}" method="get">
    @csrf
    <button type="submit">Get Csrf</button>
</form>
</body>
</html>
