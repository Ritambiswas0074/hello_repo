import '../App.css'
import './About.css'

function About() {
  return (
    <div className="App">
      <main className="page-container">
        <div className="page-content">
          <h1 className="page-title">
            <span className="gradient-magenta">About</span>{' '}
            <span className="gradient-blue">FeatureMe</span>
          </h1>
          <p className="page-description">
            Making your moments shine on the biggest screens
          </p>

          <div className="about-content">
            <div className="about-section">
              <h2>Our Mission</h2>
              <p>
                FeatureMe is a revolutionary platform that allows you to feature yourself, 
                your loved ones, family, or branding on premium billboards across the country. 
                We believe everyone deserves their moment in the spotlight.
              </p>
            </div>

            <div className="about-section">
              <h2>How It Works</h2>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Upload</h3>
                  <p>Upload your videos and photos</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Select Location</h3>
                  <p>Choose from our available billboard locations</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Schedule</h3>
                  <p>Pick your dates using our calendar</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h3>Feature</h3>
                  <p>Watch your content shine on the big screen</p>
                </div>
              </div>
            </div>

            <div className="about-section">
              <h2>Connect With Us</h2>
              <p>Follow us on social media to stay updated</p>
              <div className="social-icons-about">
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                  <defs>
                    <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff00ff" />
                      <stop offset="50%" stopColor="#b84dff" />
                      <stop offset="100%" stopColor="#00bfff" />
                    </linearGradient>
                    <linearGradient id="linkedinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00bfff" />
                      <stop offset="100%" stopColor="#0066ff" />
                    </linearGradient>
                    <linearGradient id="facebookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#b84dff" />
                      <stop offset="100%" stopColor="#ff00ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link-about">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link-about">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link-about">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default About

