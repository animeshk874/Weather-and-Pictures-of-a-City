# Weather-and-Pictures-of-a-City
Tells the current weather and shows some of the pictures that were recently taken in a city.

**Here's a screenshot of the app.**
![Screenshot](https://raw.githubusercontent.com/animeshk874/Weather-and-Pictures-of-a-City/master/screens/mac-new.png)

# Implementaion Details

This app is based on the **publish/subscribe** design pattern. It uses [Ben Alman's Tiny Pub/Sub](https://github.com/cowboy/jquery-tiny-pubsub) implementation to publish and subscribe to events. Whenever the submit button is clicked, the app publishes a **formSubmitted** event which is listened by the subscribers of the event.

# APIs used

[Pixabay API](https://pixabay.com/api/docs/)

[Open Weather Map API(Current Weather)](https://openweathermap.org/api)

