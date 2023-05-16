# myFlix-client\*\*

https://myflix-jd.netlify.app/

## Table of Contents

- [Overview](#overview)
- [Users](#users)
- [Features](#features)
- [Components](#components)
  - [LoginView](#loginview)
  - [SignupView](#signupview)
  - [NavigationBar](#navigationbar)
  - [MovieCard](#moviecard)
  - [MovieView](#movieview)
  - [ProfileView](#profileview)

## Overview

This project is a client-side application built using React, that connects to an existing server-side codebase (REST API and database) for an application called myFlix. The goal is to create a polished, responsive, single-page application with routing and rich interactions, providing a seamless user experience for movie enthusiasts.

## Users

The users of the myFlix application will be movie enthusiasts who enjoy reading information about different movies.

## Features

- Users can register a new account or log in to an existing account.
- Users can update their user information and favorite movies from their profile page.
- Users can add or remove movies from their favorites list by clicking on the favorites icon on each movie from the main view.
- Users can search for movies by title, genre, or director via the search options located on the navigation bar.
- Responsive design allows for usage on any device, online.

## Components

## LoginView

![Login](/src/img/LoginCard.jpg)

This is a functional component that displays a login form with inputs for the username and password, and a submit button. The component uses **React** and **useState** for handling component state and lifecycle methods, as well as **Button** and **Form** from **react-bootstrap** for styling the form and button, **Card** from **react-bootstrap** for styling the card, **./login-view.scss** for styling, and **logo** from **../../img/logo-color.svg** for displaying the app logo.

The component takes in props **onLoggedIn** and **setLoading** as arguments, and has two state variables **username** and **password** which are controlled by the form inputs. A submit button makes a POST request to the login endpoint with the data. If the server returns a user object, the component stores the user and token in local storage and calls the **onLoggedIn** function.

## SignupView

![Registration](/src/img/RegistrationCard.jpg)

This component allows the user to create a new account by providing a username, password, email, and birthday. On successful signup, the user is logged in and the token is stored in localstorage.

## NavigationBar

![NavBar](/src/img/NavigationBar.jpg)

This component is a navigation bar that appears at the top of the page on all views. It provides links to the different pages of the application, and also allows users to search for movies and filter their search results by title, genre, and director.  The NavigationBar component is a presentational component that takes the following props:

- **user**: An object representing the currently logged-in user
- **onSearch**: A function that is called when the user submits the search form. It takes the search query and filter criteria as arguments.

It also has some state variables to keep track of the search query and filter criteria, and event handlers to handle changes to the search form inputs and form submission.

## MovieCard

![MovieCard](/src/img/MovieCard.jpg)

This component is a presentational component that displays a movie card with the movie poster, title, and a favorite button. It takes the following props:

- **movie**: An object representing the movie
- **onFavorite**: A function that is called when the favorite button is clicked. It takes the movie id as an argument.

It uses the **Card** component from **react-bootstrap** for styling and **./movie-card.scss** for additional styling. The favorite button is a toggle button that changes state when clicked, and calls the **onFavorite** prop function with the movie id as an argument.

## MovieView

![MovieView](/src/img/MovieView.jpg)

This component is a container component that displays the details of a selected movie. It takes the following props:

- **movieId**: A string that represents the id of the selected movie
- **user**: An object representing the currently logged-in user

It uses the **useEffect** hook to fetch the movie data from the server when the component is mounted and updates. It also has a state variable and event handlers to handle updates to the user's favorite list and a function to send a PUT request to the server to update the user's favorite list.

## ProfileView

![ProfileView](/src/img/ProfileView.jpg)

This component is a container component that displays the user's profile information and allows the user to update their user information and favorite movies. It takes the following props:

- **user**: An object representing the currently logged-in user

![EditProfile](/src/img/EditProfile.jpg)

It has state variables and event handlers to handle updates to the user's profile information and favorite list, and a function to send a PUT request to the server to update the user's profile information and favorite list.

It also uses the **Form** and **Button** components from **react-bootstrap** for styling the form and buttons, and **./profile-view.scss** for additional styling.

This is an overview of how the components are organized and how they interact with each other and the server-side. With these components, the myFlix client-side application should provide a seamless and rich user experience for movie enthusiasts.
