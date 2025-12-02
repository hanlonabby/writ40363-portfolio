# Personal Dashboard

A responsive personal dashboard featuring weather, daily quotes, and task management.

## Features

- **Weather Widget**: Displays current weather conditions
- **Daily Quotes**: Random inspirational quotes with refresh button
- **Task Manager**: Add, complete, and delete personal tasks
- **Dark/Light Theme**: Toggle between themes with persistence
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Data Persistence**: Tasks and theme preferences saved locally

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript (ES6+)
- fetch() API
- localStorage

## Live Demo

🔗 [View Live Dashboard](https://your-username.github.io/your-repo-name/)

## Setup

1. Clone the repository
2. Open `index.html` in a web browser (use Live Server for development)
3. Customize `data/weather.json` and `data/quotes.json` with your own data

## Project Structure

\```
project3-dashboard/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles including themes
├── js/
│   └── app.js          # All JavaScript functionality
├── data/
│   ├── weather.json    # Weather data
│   └── quotes.json     # Quotes collection
└── README.md           # This file
\```

## Future Enhancements

- Real weather API integration
- Quote categories and filtering
- Task categories and priorities
- Export/import tasks feature
- Additional widgets

## Author

Abby Hanlon

## License

MIT License

## Reflection 

Abby Hanlon
Multimedia Authoring: Mobile Apps and eBooks 045 (Rode)
Project 3 Reflection
12/2/25

Technical Understanding
How is fetch () different from localStorage?
When would you use each one?
What are the advantages and limitations of each approach?
How did you combine both in your dashboard?
Fetch() loads data from an external source, file, or other data point, not from local information a developer has on their end. LocalStorage is information that I, and other web developers, upload to their code. In this case, I “fetched” external data by importing JSON files, such as weather data (which I pulled from AccuWeather.com/Chicago), and quotes from some of my favorite people/artists, found in a quick Google search. Fetch is asynchronous because the results don’t return immediately; it emulates a (. then()) statement. On the other hand, localStorage is synchronous: a developer can read or write it, and the changes appear immediately. Developers can use fetch() to retrieve data from a file, such as weather data for a specific location or data about a particular person, place, or thing. This data comes from JSON files, which makes data fetching easy and efficient. When implementing fetch in web development, the website you create should be updated regularly as the JSON file changes. I use localStorage when I need information to persist across page refreshes, like my tasks, or, in other projects, reviews I’ve written about various coffee shops and other establishments in the Fort Worth area. 
	There are pros and cons to using both fetch () and localStorage. The advantages of implementing fetch() include helping developers load large datasets onto their websites, allowing dashboards and other applications to display more detailed, up-to-date data points such as ever-changing weather, and taking up little space on the developer’s storage. 

How do CSS custom properties (variables) enable theme switching?
What’s the difference between :root and body.theme-dark?
How does changing a class on body update the entire page?
Why is this approach better than hardcoding colors?
CSS variables make theme-switching possible because they can change the entire webpage’s color system at once with one button. Storing my design variables in CSS lets the site as a whole change because it uses variables rather than hard-coded colors. If you decide to use hard-coded colors, it would take the developer longer to create a “dark mode” feature, because you would have to hand-code each element in a darker color mode. Using :root sets the default color theme for your website; in this case, mine is “light mode.” Implementing body-theme.dark reverses the default theme set to the other values you have coded. Using this approach is much more efficient than hardcoding colors because it keeps the design workable as the project grows. If I ever want to update the color palette or add new themes, I only need to modify variables rather than rewrite long lines of code. Implementing CSS into this project and previous projects only strengthened my confidence in web design and site maintenance.

What was the most challenging part of this project?
Be specific about what made it difficult
Was it fetch (), JSON, integration, styling, or something else?
Did you eventually overcome this challenge?
This project made me mostly proud of my skills and how much I’ve grown in my coding abilities and understanding of how different languages, files, and interfaces work. I will say that at one point, my hard-coded localStorage was completely overriding my fetch() code. For a couple of class periods, my dashboard wouldn’t display any JSON file data points I had sourced from various places. All that appeared was “Weather …” or “quote …”. It was really frustrating, as I had no idea at first where my code was broken and had to backtrack a lot to find the issue. It turns out I had a couple of errors in my HTML that triggered the JSON files to not read correctly. To fix this issue, I used a couple of AI integration features in VS Code to highlight the problems, which was a great resource that helped me work through my difficulties faster and learn from my mistakes. Learning how to use the VS Code AI integration in class has been a great tool, making it easier and more hands-on to understand where I might have made a typo. 

Problem-Solving Process
What surprised you most about building a multi-widget dashboard?
What worked easier than expected?
What took longer than anticipated?
How did this compare to Project 2’s single-purpose app?
I really liked this project. In class, I found the instructions easy to follow, and I wasn’t alone when my peers and I were confused at times. We were able to work through problems together and find solutions, and I feel stronger in my ability to build and maintain a multi-widget dashboard with distinct sections. I feel like overall, this project was easier to work on and finish than Project 2. It was cool to see firsthand how implementing JSON files into my project could be directly reflected in my workable dashboard. Although I had to overcome a couple of typos along the way, I had much more success getting every purpose of my dashboard to work correctly compared to my previous Project 2. 

Growth & Comparison
How does this project show your growth since Project 1 (Portfolio)?
Compare your HTML/CSS skills now versus then
How comfortable are you with responsive design?
What would you do differently if you were rebuilding your portfolio now?
I have grown in my understanding of how responsive design works and reacts since the completion of Project 1. I’m proud to have integrated responsive features like dark mode into my latest project, because that’s an essential baseline for the future of web design and maintenance. I believe my regular HTML experience has developed as I’ve become better at understanding the tagging, language, and purpose of each line of code. I think I’m most fascinated by the elements of CSS and what users can do to make a website even more visually appealing by applying different design techniques. If I were to rebuild my portfolio now, I would add responsive buttons that provide an overview of each of my projects and/or areas of expertise, and link to sub-pages where I go more in-depth on my projects, real-world experience, and skill sets. I have goals to take the skills I’ve learned in this class and apply them to a real, professional portfolio I’m in the process of building, so my work stands out to employers. 

Real-World Applications
What other applications could benefit from a dashboard interface?
Think beyond personal use
What data would be useful to display in widgets?
How could this approach scale to larger applications?
The first idea I had was to implement a dashboard in Continuous Glucose Monitoring apps. As a Type 1 Diabetic, I use the Dexcom app, which connects wirelessly via Bluetooth to my CGM sensor to show me my blood glucose levels in real time. I open this app a couple of times per hour and receive notifications every 5 minutes. The app itself has experimented with implementing a notes section for users to add details about how many carbs they’ve eaten, how many units of insulin they’ve taken, and other data points. In my opinion, I’ve tried to keep up with adding notes on my exercise levels, the amount of sugar and carbs in my lunches, and the insulin I draw up to offset those additives; however, it’s really unattainable to keep up with regularly, especially when I’m on the go so often. I believe if CGM apps offered a dashboard interface where users could very quickly log that they took units of insulin at various meals or times, and/or provided some type of check-box system, it would positively impact the app user’s lifestyle and health goals.
