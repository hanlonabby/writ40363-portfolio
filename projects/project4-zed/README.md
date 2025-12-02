# Project Zed: Music Playlist Manager

**Course:** WRIT 40363 - Upskilling with AI  
**Semester:** Fall 2025  
**Developer:** Abby Hanlon  
**Project Type:** AI-Assisted Web Application

---

## 📖 Overview

This project is part of my WRIT 40363 course, focusing on upskilling web development techniques through AI collaboration. Project Zed represents the culmination of skills learned across Projects 1-3, enhanced with AI assistance to push beyond my current skill level.

**Project Goal:** A personal music library organizer where users can manually add songs, create custom playlists, and receive simple recommendations based on their own library data—no external APIs required.

**Live Demo:** [Coming Soon - GitHub Pages Link]

---

## 🎯 About This Project

Project Zed is about **learning and understanding** rather than perfection. This is a completely new web application built from scratch with vanilla HTML, CSS, and JavaScript, demonstrating:
- Advanced techniques from earlier course projects
- New skills learned through AI collaboration
- Modular code architecture with clean separation of concerns
- Thorough documentation of the AI collaboration process
- Both successes and challenges in the development journey

**The focus is on understanding every line of code I write, not just shipping features.**

---

## 🛠️ Technologies Used

- **HTML5** - Semantic markup, accessibility features, form elements
- **CSS3** - Custom properties (CSS variables), Grid and Flexbox layouts, responsive design (3 breakpoints), theme switching
- **JavaScript (ES6+)** - Modular architecture, localStorage API, array methods, DOM manipulation, event delegation
- **No External APIs** - All data is user-generated and stored locally
- **AI Tools** - GitHub Copilot (in VS Code), ChatGPT/Claude (for planning and learning)
- **GitHub Pages** - Deployment and hosting

---

## ✨ Core Features (MVP)

### 1. **Song Library**
- ✅ Add songs through a form (title, artist, genre, mood, optional album)
- ✅ Display all songs in a clean, browsable interface
- ✅ Persistent storage using localStorage

### 2. **Playlist Management**
- ✅ Create custom named playlists
- ✅ Add songs from library to playlists
- ✅ Remove songs from playlists
- ✅ View all songs within each playlist

### 3. **Simple Recommendations**
- ✅ Get "you might also like" suggestions from existing library
- ✅ Recommendation logic based on matching genre, mood, or artist
- ✅ Quick-add recommended songs to playlists

### 4. **Data Persistence**
- ✅ All songs and playlists saved to localStorage
- ✅ Data persists across browser sessions

---

## 🚀 Stretch Features (Post-MVP)

- **Theme Switching:** Light/dark mode toggle using CSS custom properties
- **Data Visualization:** Chart showing library breakdown by genre or mood
- **Enhanced Accessibility:** Full keyboard navigation and screen reader support
- **Advanced Filtering:** Search and filter songs by multiple criteria
- **Export/Import:** Download library as JSON or import from file

---

## 🎓 Upskilled Techniques

This project demonstrates at least **3 upskilled techniques** from the course:

### From Project 1 (HTML/CSS Foundations)
- **Responsive Layout (3 breakpoints):** Mobile (<768px), Tablet (768-1023px), Desktop (>1024px)
- **Advanced Grid/Flexbox:** Complex multi-column layouts and flexible card systems
- **CSS Custom Properties:** Theme switching with CSS variables for colors and spacing

### From Project 2 (JavaScript Fundamentals)
- **Modular File Architecture:** Separation of concerns across state.js, ui.js, recommendations.js, main.js
- **Complex Data Structures:** Arrays of objects, ID-based referencing between playlists and songs
- **Form Validation & Error Handling:** Input validation, user feedback, duplicate prevention

### From Project 3 (APIs & Advanced JS)
- **Clean State Management:** Centralized state object with predictable update patterns
- **localStorage API:** Persistent data with serialization/deserialization
- **Advanced Array Methods:** filter(), map(), find(), some() for data manipulation

### New Techniques (Learned via AI)
- **Data Visualization:** Visual representation of library statistics using Canvas or CSS
- **Accessibility Improvements:** ARIA labels, semantic HTML, keyboard navigation
- **Recommendation Algorithm:** Simple similarity matching based on song attributes

---

## 📂 Project Structure

```
project4-zed/
├── index.html                    # Main HTML structure
├── README.md                     # Project documentation (this file)
├── AI_COLLABORATION_LOG.md       # AI collaboration journal
├── REFLECTION.md                 # Final reflection essay
├── css/
│   └── styles.css                # All application styles
├── js/
│   ├── state.js                  # State management + localStorage
│   ├── ui.js                     # DOM manipulation + rendering
│   ├── recommendations.js        # Recommendation logic
│   └── main.js                   # App initialization + event handlers
└── images/
    └── (optional icons/graphics)
```

---

## 🚦 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- Basic understanding of HTML, CSS, and JavaScript

### Installation & Setup
1. Clone this repository
2. Navigate to the project directory: `cd projects/project4-zed`
3. Open `index.html` in your browser, or
4. Use a local development server (recommended):
   ```bash
   # If you have Python installed:
   python -m http.server 8000
   # Or with Node.js:
   npx http-server
   ```
5. Navigate to `http://localhost:8000` in your browser

### Local Development
No build process required—this is vanilla web development. Simply:
1. Edit files in your code editor
2. Refresh browser to see changes
3. Use browser DevTools for debugging

---

## 🎨 User Stories

1. **As a user, I want to add a new song** with title, artist, genre, and mood so I can build my personal music library.

2. **As a user, I want to see all my songs** displayed in a readable format so I can browse what I've added.

3. **As a user, I want to create a new playlist** with a custom name so I can organize songs by theme or mood.

4. **As a user, I want to add songs from my library to a playlist** so I can curate collections.

5. **As a user, I want to remove songs from a playlist** so I can keep my playlists current.

6. **As a user, I want to view all songs inside a specific playlist** so I can see my collections.

7. **As a user, I want to get song recommendations** based on genre or mood so I can discover similar music.

8. **As a user, I want my songs and playlists to persist** when I close the app so I don't lose my work.

---

## 📊 Data Model

### Song Object
```javascript
{
  id: "song_1670012345678",      // Unique timestamp-based ID
  title: "Bohemian Rhapsody",
  artist: "Queen",
  genre: "Rock",
  mood: "Epic",
  album: "A Night at the Opera"  // Optional
}
```

### Playlist Object
```javascript
{
  id: "playlist_1670012345679",
  name: "Road Trip Jams",
  songIds: ["song_1670012345678", "song_1670012345680"],
  createdAt: "2025-12-02T10:30:00Z"
}
```

### Application State
```javascript
{
  songs: [/* array of song objects */],
  playlists: [/* array of playlist objects */]
}
```

**Design Rationale:**
- Unique IDs enable reliable references between playlists and songs
- Playlists store song IDs (not full objects) to avoid data duplication
- Structure is easily serialized to/from localStorage
- Extensible for future enhancements

---

## 📅 Development Timeline

### Stage 1: Planning & Setup ✅
- Define MVP and user stories
- Design data model
- Create file structure
- Plan layout and architecture

### Stage 2: Core Development (In Progress)
- Build HTML structure
- Implement base CSS and responsive skeleton
- Develop core JavaScript functionality
- Add playlist logic and recommendations
- Implement validation and error handling

### Stage 3: Enhancements (Upcoming)
- Add theme switching
- Complete responsive design for all breakpoints
- Enhance accessibility features
- Add data visualization
- Code cleanup and refactoring

### Stage 4: Final Polish (Upcoming)
- Deploy to GitHub Pages
- Integrate into portfolio
- Complete AI collaboration log
- Write final reflection

---

## 🤖 AI Collaboration

This project was built in collaboration with AI coding assistants. The full collaboration process, including:
- Prompting strategies and refinement
- Debugging sessions and problem-solving
- Learning moments and misconceptions
- Code explanations and teaching moments

...is thoroughly documented in **`AI_COLLABORATION_LOG.md`**.

**Key AI Tools Used:**
- GitHub Copilot (integrated in VS Code)
- ChatGPT/Claude (for planning, debugging, and learning)

**AI Collaboration Philosophy:**
Working with AI is about learning, not just generating code. Every piece of code is understood before implementation, and the process is documented to demonstrate growth in both coding skills and AI collaboration skills.

---

## 📝 Reflection

A detailed reflection (500-750 words) on the development process, upskilling journey, challenges faced, and lessons learned is documented in **`REFLECTION.md`**.

Key reflection topics:
- What I built and why I chose this project
- Which skills I upskilled and how
- How AI shaped my development process
- What surprised me or challenged my assumptions
- What I would do differently next time
- How my confidence as a developer has changed

---

## 🔗 Live Demo

**[Coming Soon - GitHub Pages Link]**

Once deployed, the app will be accessible at:  
`https://hanlonabby.github.io/writ40363-portfolio/projects/project4-zed/`

---

## 📜 License

This project is part of an academic assignment for TCU's WRIT 40363 course. Created for educational purposes.

---

## 🙏 Acknowledgments

- **Course:** WRIT 40363 - Upskilling with AI
- **Institution:** Texas Christian University
- **AI Partners:** GitHub Copilot, ChatGPT/Claude
- **Inspiration:** Personal need for a simple, privacy-focused music organizer

---

**Last Updated:** December 2, 2025  
**Project Status:** Stage 1 Complete - Planning & Documentation
- Upskilling of techniques from Projects 1-3
- Effective AI collaboration and documentation
- Ambitious feature development and problem-solving
- Honest reflection on learning process and challenges

---

**Note:** This project emphasizes learning and growth over perfection. Challenges and partial implementations are documented as valuable learning experiences.
