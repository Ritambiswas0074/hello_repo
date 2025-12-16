import { useState } from 'react'
import { Link } from 'react-router-dom'
import Stepper, { Step } from '../components/Stepper'
import TextType from '../components/TextType'
import '../App.css'
import './Home.css'
import './Contact.css'

function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Optionally close modal after submission
    // setIsContactModalOpen(false)
  }

  const openContactModal = () => {
    setIsContactModalOpen(true)
  }

  const closeContactModal = () => {
    setIsContactModalOpen(false)
  }

  return (
    <div className="App home-page">
      {/* Hero Section */}
      <main className="hero">
        <div></div>
        <h1 className="hero-title">
          <span className="gradient-magenta">Feature</span>{' '}
          <span className="gradient-blue">on</span>{' '}
          <span className="gradient-magenta">Billboards</span>
        </h1>
        
        <p className="hero-description-large">
          <strong>FeatureMe</strong> is a revolutionary platform that lets you feature yourself, your loved ones, family photos, or brand content on premium billboards in major cities. Simply upload your videos and photos, choose from our available billboard locations, and schedule when you want your content displayed.
        </p>
        <div className="hero-buttons">
          <Link to="/locations" className="btn btn-blue">Uplaod Now</Link>
        </div>
      </main>

      {/* What is FeatureMe - Clear Explanation */}
      <section className="info-section">
        <div className="info-card">
          <h3>What is FeatureMe?</h3>
          <TextType 
            text={[
              "FeatureMe is your gateway to billboard advertising. Whether you want to celebrate a special moment, create a surprise, or promote your brand, we make it easy to get your content displayed on premium billboards in prime locations across major cities.",
              "Transform your moments into unforgettable experiences on the biggest screens in the world.",
              "Join thousands who have made their memories shine on billboards across major cities."
            ]}
            typingSpeed={30}
            pauseDuration={3000}
            showCursor={true}
            cursorCharacter="|"
            className="info-typing-text"
          />
        </div>
      </section>

      {/* How It Works - Visual Steps */}
      <section className="how-it-works-section">
        <h2 className="section-title">
          <span className="gradient-magenta">How to</span>{' '}
          <span className="gradient-blue">Feature</span>{' '}
          <span className="gradient-magenta">Your Content ?</span>
        </h2>
        <div className="stepper-wrapper">
          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(step);
            }}
            onFinalStepCompleted={() => {
              // Auto-advance will loop back to step 1
            }}
            backButtonText="Previous"
            nextButtonText="Next"
            stepCircleContainerClassName="how-it-works-stepper"
            autoAdvance={true}
            autoAdvanceInterval={3000}
            disableStepIndicators={true}
          >
            <Step>
              <div className="step-content">
                <h3>Select Location</h3>
                <p>Choose from our available billboard locations in major cities worldwide</p>
              </div>
            </Step>
            <Step>
              <div className="step-content">
                <h3>Schedule Date</h3>
                <p>Pick the date when you want your content displayed on the billboard</p>
              </div>
            </Step>
            <Step>
              <div className="step-content">
                <h3>Upload Content</h3>
                <p>Upload your videos and photos that you want to feature on billboards</p>
              </div>
            </Step>
            <Step>
              <div className="step-content">
                <h3>Payment</h3>
                <p>Complete payment according to your selected plan and go live</p>
              </div>
            </Step>
          </Stepper>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="perfect-for-section">
        <h2 className="section-title">
          <span className="gradient-magenta">Perfect For</span>
        </h2>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <div className="use-case-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff00ff" />
                    <stop offset="100%" stopColor="#00bfff" />
                  </linearGradient>
                </defs>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#gradient1)" />
              </svg>
            </div>
            <h3>Special Occasions</h3>
            <p>Birthdays, anniversaries, proposals, graduations, and milestone celebrations</p>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff00ff" />
                    <stop offset="100%" stopColor="#00bfff" />
                  </linearGradient>
                </defs>
                <path d="M16 4C18.11 4 20 5.89 20 8C20 10.11 18.11 12 16 12C15.71 12 15.44 11.97 15.18 11.91C14.77 13.25 13.5 14.22 12 14.22C10.5 14.22 9.23 13.25 8.82 11.91C8.56 11.97 8.29 12 8 12C5.89 12 4 10.11 4 8C4 5.89 5.89 4 8 4C8.29 4 8.56 4.03 8.82 4.09C9.23 2.75 10.5 1.78 12 1.78C13.5 1.78 14.77 2.75 15.18 4.09C15.44 4.03 15.71 4 16 4ZM9 7C8.45 7 8 7.45 8 8C8 8.55 8.45 9 9 9C9.55 9 10 8.55 10 8C10 7.45 9.55 7 9 7ZM15 7C14.45 7 14 7.45 14 8C14 8.55 14.45 9 15 9C15.55 9 16 8.55 16 8C16 7.45 15.55 7 15 7ZM12 11C13.1 11 14 10.1 14 9H10C10 10.1 10.9 11 12 11Z" fill="url(#gradient2)" />
              </svg>
            </div>
            <h3>Family Moments</h3>
            <p>Celebrate your family with beautiful photos displayed on billboards</p>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff00ff" />
                    <stop offset="100%" stopColor="#00bfff" />
                  </linearGradient>
                </defs>
                <path d="M10 2V4H8V6H6V8H4V10H2V12H4V14H6V16H8V18H10V20H14V18H16V16H18V14H20V12H22V10H20V8H18V6H16V4H14V2H10ZM12 4H14V6H16V8H18V10H20V12H18V14H16V16H14V18H12V20H10V18H8V16H6V14H4V12H6V10H8V8H10V6H12V4ZM11 7H13V9H15V11H13V13H11V11H9V9H11V7ZM11 15H13V17H11V15Z" fill="url(#gradient3)" />
              </svg>
            </div>
            <h3>Brand Promotion</h3>
            <p>Promote your business, product, or brand on premium billboard locations</p>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff00ff" />
                    <stop offset="100%" stopColor="#00bfff" />
                  </linearGradient>
                </defs>
                {/* Gift box */}
                <rect x="5" y="8" width="14" height="10" rx="1" fill="url(#gradient4)" />
                {/* Ribbon vertical */}
                <rect x="11.5" y="8" width="1" height="10" fill="url(#gradient4)" />
                {/* Ribbon horizontal */}
                <rect x="5" y="12.5" width="14" height="1" fill="url(#gradient4)" />
                {/* Bow left */}
                <path d="M11.5 8C11.5 6.9 10.6 6 9.5 6C8.4 6 7.5 6.9 7.5 8H11.5Z" fill="url(#gradient4)" />
                {/* Bow right */}
                <path d="M12.5 8C12.5 6.9 13.4 6 14.5 6C15.6 6 16.5 6.9 16.5 8H12.5Z" fill="url(#gradient4)" />
                {/* Confetti pieces */}
                <circle cx="4" cy="6" r="1" fill="url(#gradient4)" />
                <circle cx="20" cy="6" r="1" fill="url(#gradient4)" />
                <circle cx="3" cy="20" r="0.8" fill="url(#gradient4)" />
                <circle cx="21" cy="20" r="0.8" fill="url(#gradient4)" />
                <path d="M2 10L3 11L2 12Z" fill="url(#gradient4)" />
                <path d="M22 10L21 11L22 12Z" fill="url(#gradient4)" />
              </svg>
            </div>
            <h3>Surprises</h3>
            <p>Create unforgettable surprises for your loved ones on the biggest screens</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Connect With Us</h2>
          <p>Follow us on social media to stay updated with the latest features, success stories, and exclusive offers</p>
          <div className="social-icons-cta">
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="instagramGradientCta" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff00ff" />
                  <stop offset="50%" stopColor="#b84dff" />
                  <stop offset="100%" stopColor="#00bfff" />
                </linearGradient>
                <linearGradient id="linkedinGradientCta" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00bfff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
                <linearGradient id="facebookGradientCta" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b84dff" />
                  <stop offset="100%" stopColor="#ff00ff" />
                </linearGradient>
              </defs>
            </svg>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link-cta">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link-cta">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link-cta">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>


      {/* Footer with Contact Information */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="gradient-magenta">Contact</span>{' '}
              <span className="gradient-blue">Us</span>
            </h3>
            <div className="contact-info-footer">
              <div className="contact-item-footer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="contact-icon">
                  <defs>
                    <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff00ff" />
                      <stop offset="100%" stopColor="#00bfff" />
                    </linearGradient>
                  </defs>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#emailGradient)" strokeWidth="2" fill="none"/>
                  <polyline points="22,6 12,13 2,6" stroke="url(#emailGradient)" strokeWidth="2" fill="none"/>
                </svg>
                <a href="mailto:support@featureme.com">support@featureme.com</a>
              </div>
              <div className="contact-item-footer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="contact-icon">
                  <defs>
                    <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff00ff" />
                      <stop offset="100%" stopColor="#00bfff" />
                    </linearGradient>
                  </defs>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="url(#phoneGradient)" strokeWidth="2" fill="none"/>
                </svg>
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </div>
              <div className="contact-item-footer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="contact-icon">
                  <defs>
                    <linearGradient id="locationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff00ff" />
                      <stop offset="100%" stopColor="#00bfff" />
                    </linearGradient>
                  </defs>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="url(#locationGradient)" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="10" r="3" stroke="url(#locationGradient)" strokeWidth="2" fill="none"/>
                </svg>
                <span>123 Billboard Ave<br />New York, NY 10001</span>
              </div>
            </div>
            <button onClick={openContactModal} className="btn-open-contact-form">
              Send us a Message
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FeatureMe. All rights reserved.</p>
        </div>
      </footer>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="contact-modal-overlay" onClick={closeContactModal}>
          <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="contact-modal-close" onClick={closeContactModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="contact-modal-container">
              {/* Left Panel - Contact Information */}
              <div className="contact-info-panel-home">
                <div className="contact-info-content-home">
                  <h2 className="contact-info-title-home">Contact Information</h2>
                  <p className="contact-info-subtitle-home">Say something to start a live chat!</p>
                  
                  <div className="contact-details-home">
                    <div className="contact-detail-item-home">
                      <div className="contact-icon-wrapper-home">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="modalPhoneIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff00ff" />
                              <stop offset="100%" stopColor="#00bfff" />
                            </linearGradient>
                          </defs>
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="url(#modalPhoneIconGradient)" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                      <span>+1 (555) 123-4567</span>
                    </div>
                    
                    <div className="contact-detail-item-home">
                      <div className="contact-icon-wrapper-home">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="modalEmailIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff00ff" />
                              <stop offset="100%" stopColor="#00bfff" />
                            </linearGradient>
                          </defs>
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#modalEmailIconGradient)" strokeWidth="2" fill="none"/>
                          <polyline points="22,6 12,13 2,6" stroke="url(#modalEmailIconGradient)" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                      <span>support@featureme.com</span>
                    </div>
                    
                    <div className="contact-detail-item-home">
                      <div className="contact-icon-wrapper-home">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="modalLocationIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff00ff" />
                              <stop offset="100%" stopColor="#00bfff" />
                            </linearGradient>
                          </defs>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="url(#modalLocationIconGradient)" strokeWidth="2" fill="none"/>
                          <circle cx="12" cy="10" r="3" stroke="url(#modalLocationIconGradient)" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                      <span>123 Billboard Ave<br />New York, NY 10001</span>
                    </div>
                  </div>

                  <div className="contact-social-links-home">
                    <a href="#" aria-label="Twitter" className="social-link-circle-home">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="#" aria-label="Instagram" className="social-link-circle-home">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" aria-label="Discord" className="social-link-circle-home">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Panel - Contact Form */}
              <div className="contact-form-panel-home">
                <form className="contact-form-main-home" onSubmit={handleSubmit}>
                  <div className="form-row-home">
                    <div className="form-group-home">
                      <label htmlFor="modalFirstName">First Name</label>
                      <input
                        type="text"
                        id="modalFirstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                      />
                    </div>
                    <div className="form-group-home">
                      <label htmlFor="modalLastName">Last Name</label>
                      <input
                        type="text"
                        id="modalLastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  <div className="form-row-home">
                    <div className="form-group-home">
                      <label htmlFor="modalEmail">Email</label>
                      <input
                        type="email"
                        id="modalEmail"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                      />
                    </div>
                    <div className="form-group-home">
                      <label htmlFor="modalPhone">Phone Number</label>
                      <input
                        type="tel"
                        id="modalPhone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 012 3456 789"
                      />
                    </div>
                  </div>

                  <div className="form-group-home">
                    <label>Select Subject?</label>
                    <div className="radio-group-subject-home">
                      <label className="radio-option-subject-home">
                        <input
                          type="radio"
                          name="subject"
                          value="general"
                          checked={formData.subject === 'general'}
                          onChange={handleChange}
                        />
                        <span>General Inquiry</span>
                      </label>
                      <label className="radio-option-subject-home">
                        <input
                          type="radio"
                          name="subject"
                          value="support"
                          checked={formData.subject === 'support'}
                          onChange={handleChange}
                        />
                        <span>Support</span>
                      </label>
                      <label className="radio-option-subject-home">
                        <input
                          type="radio"
                          name="subject"
                          value="billing"
                          checked={formData.subject === 'billing'}
                          onChange={handleChange}
                        />
                        <span>Billing</span>
                      </label>
                      <label className="radio-option-subject-home">
                        <input
                          type="radio"
                          name="subject"
                          value="other"
                          checked={formData.subject === 'other'}
                          onChange={handleChange}
                        />
                        <span>Other</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group-home">
                    <label htmlFor="modalMessage">Message</label>
                    <textarea
                      id="modalMessage"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message.."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-send-message-home">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

