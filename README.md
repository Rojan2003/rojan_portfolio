# Rojan Derosa — Professional Portfolio

A clean, modern portfolio website showcasing technical experience across IT operations, cloud infrastructure (AWS), web development, and virtual assistance.

## 👋 About Me

Technical professional with hands-on experience in:
- **IT & Infrastructure**: Windows Server, Active Directory, Remote Desktop Services (RDS)
- **Cloud Operations**: AWS (Lambda, CloudWatch, IAM, CloudFormation, EventBridge)
- **Web Development**: Laravel, PHP, MySQL, JavaScript, REST APIs
- **DevOps & Systems**: Linux, Docker, PowerShell, Git, system troubleshooting
- **Remote Operations**: Virtual assistance, project coordination, technical documentation

Currently working as **IT Operations & Technical Support Specialist** at BigDogBuilds, managing production infrastructure and troubleshooting complex systems across AWS.

## 🌐 View the Portfolio

**Live Version** (if hosted):
- Netlify: `[your-netlify-domain].netlify.app`
- GitHub Pages: `github.com/Rojan2003/portfolio`

**Local View**:
1. Clone this repository
2. Open `portfolio.html` in your browser
3. No build process or dependencies required

## 📁 Repository Contents

```
portfolio/
├── portfolio.html      # Main portfolio website
├── README.md          # This file
└── screenshot.png     # Portfolio preview (optional)
```

## 🛠 Technologies Used

- **HTML5** — Semantic markup, accessibility
- **CSS3** — Responsive design, modern styling
- **No frameworks** — Pure HTML/CSS, zero dependencies
- **Mobile-friendly** — Works perfectly on phones, tablets, desktops

## 🎨 Design Features

- Clean, professional aesthetic
- Responsive layout (mobile-first)
- Fast loading (no external dependencies)
- Dark mode support (respects system preferences)
- Accessibility-first approach
- Print-friendly design

## 📱 Responsive Design

The portfolio looks great on all devices:
- **Desktop** (1920px+) — Full multi-column layout
- **Tablet** (768px - 1919px) — Optimized grid
- **Mobile** (320px - 767px) — Single column, touch-friendly

## 🚀 How to Deploy

### Option 1: Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Drag & drop `portfolio.html` or connect your repo
4. Get a live URL instantly
5. Share your portfolio link

### Option 2: GitHub Pages
1. Fork or clone this repository
2. Go to repository **Settings** → **Pages**
3. Set source to `main` branch
4. Your portfolio is live at `github.com/Rojan2003/portfolio`

### Option 3: Static Hosting
Compatible with any static host:
- Vercel
- AWS S3 + CloudFront
- Google Cloud Storage
- Firebase Hosting
- GitHub Pages
- Any web server

### Option 4: Local File
- Simply open `portfolio.html` in your browser
- Perfect for sharing as an attachment via email

## 📝 How to Customize

### Edit Contact Information
```html
<div class="contact-info">
  <div><a href="mailto:your-email@example.com">your-email@example.com</a></div>
  <div><a href="https://github.com/yourusername" target="_blank">GitHub</a></div>
</div>
```

### Update Skills
Find the `<div class="skill-category">` sections and edit the skill lists:
```html
<div class="skill-category">
  <h3>Your Skill Category</h3>
  <ul class="skill-list">
    <li>Skill 1</li>
    <li>Skill 2</li>
    <li>Skill 3</li>
  </ul>
</div>
```

### Add/Edit Experience
```html
<div class="experience-item">
  <div class="job-title">Your Job Title</div>
  <div class="company">Company Name</div>
  <div class="dates">Start Year – End Year</div>
  <div class="job-description">
    Your job description here.
  </div>
  <div class="highlights">
    <div class="highlight">Achievement or responsibility</div>
  </div>
</div>
```

### Change Colors
The portfolio uses a blue color scheme (`#185fa5`). To change colors:
1. Open `portfolio.html` in a text editor
2. Find and replace `#185fa5` with your preferred hex color
3. Also update related shades (`#0c447c`, `#042c53`, `#e6f1fb`)

### Customize Typography
All fonts are system fonts for fast loading. To use Google Fonts:
1. Add to `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT" rel="stylesheet">
```
2. Update the `font-family` in CSS

## 🔗 Links & Contact

- **Email**: rojanjw02@gmail.com
- **GitHub**: [github.com/Rojan2003](https://github.com/Rojan2003)
- **LinkedIn**: [linkedin.com/in/rojan-derosa-935049253](https://linkedin.com/in/rojan-derosa-935049253)
- **Phone**: +63 955 085 1017

## 📊 Portfolio Sections

1. **Header** — Name, title, contact information
2. **About** — Professional summary
3. **Core Expertise** — 6 skill categories with detailed lists
4. **Experience** — Work history and roles
5. **Featured Projects** — Highlight projects with descriptions
6. **Learning** — Commitment to continuous improvement
7. **Call-to-Action** — Contact button and GitHub link

## 🎯 Use Cases

This portfolio is perfect for:
- ✅ Job applications — Share the link with recruiters
- ✅ Email signature — Include portfolio link in professional emails
- ✅ GitHub profile — Link from your GitHub bio
- ✅ Social media — Share on LinkedIn, Twitter, etc.
- ✅ Interviews — Have the portfolio ready on your phone/laptop
- ✅ Portfolio review — Get feedback from peers

## 📋 Best Practices for Using Your Portfolio

1. **Always include a link** — Job applications, emails, messaging
2. **Keep it updated** — Add new projects and skills as you grow
3. **Get feedback** — Share with mentors and colleagues
4. **Test on mobile** — Make sure it looks good on your phone
5. **Monitor visitors** — Use Google Analytics if hosted online (optional)

## 🔧 Advanced Customization

### Add Google Analytics
Add this before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Add a Light/Dark Mode Toggle
JavaScript can be added to toggle the theme — contact me for implementation details.

### Add Portfolio Images/Screenshots
Add an images folder and include project screenshots:
```html
<img src="images/project-screenshot.jpg" alt="Project name" style="max-width: 100%; border-radius: 8px;">
```

## 📄 License

This portfolio template is open source and available for your use. Feel free to customize and share.

## 🙋 Questions?

If you have questions or want to improve the portfolio:
1. Open an issue on GitHub
2. Email me at rojanjw02@gmail.com
3. Check the code — it's heavily commented

---

**Built with ❤️ by Rojan Derosa**

Last updated: September 2026

---

## 📈 Share Your Portfolio

### Social Media Links
- Share with: "Check out my portfolio: [your-portfolio-url]"
- LinkedIn: Pin to your profile
- GitHub: Add to your bio
- Twitter/X: Include in your profile

### Email Signature
```
Rojan Derosa
Technical Professional | IT Operations | AWS | Web Development
📱 +63 955 085 1017
💼 Portfolio: [your-portfolio-url]
🔗 GitHub: github.com/Rojan2003
```

### Job Application Template
```
Hi [Hiring Manager],

I'm interested in the [Job Title] position. Here's my portfolio 
showcasing my experience:

[your-portfolio-url]

Looking forward to discussing this opportunity!

Best regards,
Rojan Derosa
```

---

## 🚀 Next Steps

1. **Deploy** — Choose a hosting option (Netlify recommended)
2. **Share** — Include portfolio link in applications
3. **Update** — Add new projects and skills as you progress
4. **Iterate** — Get feedback and improve continuously

Good luck! 🎯
