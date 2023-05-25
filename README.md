# Camp API Documentation

These documents are used for the  [kamp-tur](https://kamp-tur-production.up.railway.app/) 

#### Contents

- [Overview](#1-overview)
- [Authentication](#2-authentication) ( [SignUp](#21-signup) / [Login](#22-login) )
- [Resources](#3-resources)
    - [Users](#31-users)  ( [Get Current User](#311-get-current-user) )
  - [Tours](#32-tours) ( [Get All Tours](#321-get-all-tours) / [Get Tour](#322-get-tour) )

## 1. Overview
•	Created a camping app that lets users buy a camp tours.  
•	Architected an Camp API which dramatically improved codebases, making them more DRY, more secure, and more efficient.  
•	Implemented authentication and authorization using JSON Web Token and Cookie.  
•	Used tools : Express.js, Mongoose, JWT, Pug Template, Stripe API.  

## 2. Authentication

In order to view some routes, you will need an access token.

### 2.1. Sign Up
For the protected routes, firstly you should sign up.

```
POST https://kamp-tur-production.up.railway.app/api/v1/users/signup
```
The first step, you should send json body. Example body:

```json
{
    "name": "exampleName",
    "email": "exampleEmail@email.com",
    "password": {{password}},
    "passwordConfirm": {{password}}
}
```

With the following fields:

| Parameter | Type | Required?  | Description |
| --- |--------|------------|------------|
| name  | string    | required   | The name of the user.   |
| email   | string | required   | The email of the user. Email should be unique. |
| password    | string   | required   | The password of the user. At least 6 characters.  |
|passwordConfirm |string |required |The password of the user.Password and passwordConfirm should be same.|


Example response: 

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmQ3YmUxYzQ4ZDM4NzU5ZGE5ZjQ1MCIsImlhdCI6MTY4NDg5NjczNywiZXhwIjoxNjkyNjcyNzM3fQ.cVffQxErJMGXsFm1M2XjByRNKCCsvdsVKu1eK-chsmE",
    "data": {
        "user": {
            "name": "exampleName",
            "email": "exampleemail@email.com",
            "photo": "default.jpg",
            "_id": "646d7be1c48d38759da9f450"
        }
    }
}
```

Where a User object is:

| Field     | Type         | Description       |
| --------------|----------|--------------|
| status  | string       | The status of your request.   |
| token     | string       | The user's token. This token has a validity of 90 days.  |
|   _id    | string       | The id of the user.    |
| name   | string  | The user's name.       |
| email    | string       | The user's email.      |
| photo  | string       | The user's photo.   |



Possible errors:

| Error code  | Description |
| ------|-------|
| 400 Bad Request | Duplicate fields or invalid input data. |


### 2.2. Login 

```
POST https://kamp-tur-production.up.railway.app/api/v1/users/login
```
The first step, you should send json body. Example body:

```json
{
    "email": "exampleEmail@email.com",
    "password": "{{password}}"
}
```

With the following fields:

| Parameter | Type | Required?  | Description |
| --- |--------|------------|------------|
| email   | string | required   | The email of the user.|
| password    | string   | required   | The password of the user.   |



Example response: 

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmMyZTFmYjk3YzM0MzUyOTRmMTZlYSIsImlhdCI6MTY4NDgyMDMwMywiZXhwIjoxNjkyNTk2MzAzfQ.hSBYBczAZuLO4DSRjWOF6-6Ambv68wH5IjAo_JKzv20",
    "data": {
        "user": {
            "_id": "646c2e1fb97c3435294f16ea",
            "name": "exampleName",
            "email": "exampleEmail@email.com",
            "photo": "default.jpg"
        }
    }
}
```

Possible errors:

| Error code  | Description |
| ------|-------|
| 400 Bad Request |  Invalid input data. Provide email and password. |
| 401 Unauthorized |  Incorrect email or password. |

## 3. Resources

The API is RESTful and arranged around resources.  All requests must be made using `https`. 

### 3.1. Users

#### 3.1.1. Get Current User
Returns details of the user who has granted permission to the application.

```
GET  https://kamp-tur-production.up.railway.app/api/v1/users/me
```

Example request header:

```
Authorization: Bearer 181d415f34379af07b2c11d144dfbe35d
```

The response is a User object within a data envelope. Example response:

```json
{
    "status": "success",
    "data": {
        "user": {
            "_id": "646c2e1fb97c3435294f16ea",
            "name": "exampleName",
            "email": "exampleEmail@email.com",
            "photo": "default.jpg"
        }
    }
}
```

Possible errors:

| Error code           | Description                                     |
| ---------------------|-------------------------------------------------|
| 401 Unauthorized     | `Token` is invalid.|

### 3.2. Tours

#### 3.2.1. Get All Tours

Returns a full list of cities. An example request looks like this:

```
GET https://kamp-tur-production.up.railway.app/api/v1/tours
```

The response is a list of tours objects. The response array is wrapped in a data envelope. This endpoint will return all tours. Example response:

```json 
{
    "status": "success",
    "results": 6,
    "data": {
        "tour": [
            {
                "startLocation": {
                    "type": "Point",
                    "coordinates": [ 34.80513487249634, 38.62006546406157 ],
                    "address": "50180 Göreme/Nevşehir Merkez/Nevşehir",
                    "description": "Nevşehir"
                },
                "_id": "5c88fa8cf4afda39709c2951",
                "name": "Kapadokya Turu",
                "duration": 3,
                "maxGroupSize": 15,
                "difficulty": "orta",
                "ratingsAverage": 4.8,
                "ratingsQuantity": 6,
                "price": 1200,
                "summary": "",
                "description": "Kayseri Havalimanı ...",
                "imageCover": "tour-2-cover.jpg",
                "images": [ "tour-2-1.jpg", "tour-2-2.jpg", "tour-2-3.jpg"],
                "startDates": [ "2023-10-19T09:00:00.000Z", "2023-10-20T09:00:00.000Z",
                    "2023-10-21T09:00:00.000Z"],
                "secretTour": false,
                "locations": [
                    {
                        "type": "Point",
                        "coordinates": [ 34.80513487249634, 38.62006546406157 ],
                        "description": "Güvercinlik Vadisi",
                        "day": 1,
                        "_id": "5c88fa8cf4afda39709c2954"
                    },
                    {
                        "type": "Point",
                        "coordinates": [ 34.86223928783937, 38.65331700844643 ],
                        "description": "Kızılçukur Vadisi",
                        "day": 2,
                        "_id": "5c88fa8cf4afda39709c2953"
                    },
                    {
                        "type": "Point",
                        "coordinates": [ 34.86341282950558, 38.6405456396141],
                        "description": "Meskendir Vadisi",
                        "day": 3,
                        "_id": "5c88fa8cf4afda39709c2952"
                    }
                ],
                "guides": [
                    {
                        "_id": "64623231215840f8462b423a",
                        "name": "Serhat Karadağ",
                        "email": "serhat@hotmail.com",
                        "photo": "default.jpg",
                    }
                ],
                "slug": "kapadokya-turu",
            },
            { ...
            }
        ]
    }
}
```

Where a Tour object is:

| Field       | Type   | Description                                     |
| ------------|--------|-------------------------------------------------|
| _id          | string | The id of tour.       |
| name        | string | The name of tour. Max length 40 characters and Min length 5 characters.  |
| duration   | number | The duration of tour.    |
| maxGroupSize  | number | The max group size of tour.    |
| difficulty        | string | The name of tour. Difficulty is either: kolay, orta, zor.   |
| ratingsAverage  | number | The ratings average of tour. Between of 1-5 |
| ratingsQuantity  | number | The ratings quantity of tour.    |
| price  | number | The price of tour.    |
| summary  | string | The summary of tour.    |
| description  | string | The description of tour.    |
| imageCover  | string | The image cover of tour.    |
| images  | string array | The images of tour.    |
| startDates  | date array | The start date of tour.    |
| secretTour  | Boolean | The secret of tour.    |
| startLocation  | object | The start location of tour.   |
| locations  | object array | The locations of tour.    |
| guides  | object array | The guides of tour.    |
| slug  | string | The agnomen of tour.    |


#### 3.2.2. Get Tour

This endpoint returns a specific city. An example request looks like this:

```
GET https://kamp-tur-production.up.railway.app/api/v1/tours/{{tourID}}
```

Possible errors:

| Error code           | Description                                                                           |
| ---------------------|---------------------------------------------------------------------------------------|
| 400 Bad Request     | `TourId` is invalid|



