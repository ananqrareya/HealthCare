<!doctype html>
<html lang="en" class="">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

<h2>
    prodact name
</h2>
<h3> price </h3>
<form action="{{route('stripe')}}" method="post">
    @csrf
    <input type="hidden" name="price" value="2">
    <button type="submit"></button>

</form>
</body>
</html>
