import Navbar from "../components/navbar";
import "../styles/App.css";
import mainImage from '../images/home-page_image.png'
import FadeInSection from "../components/FadeInSection";
import AboutCard from "../components/AboutCard";
import AboutUs from "../components/AboutUs";
import card1 from '../images/card1.png'
import card2 from '../images/card2.png'
import card3 from '../images/card3.png'
import member1 from '../images/member1.png'
import member2 from '../images/member2.png'
import emailIcon from '../images/email.png'
import locationIcon from '../images/location.png'
import linkedinIcon from '../images/linkedin.png'
import githubIcon from '../images/github.png'
import instagram from '../images/instagram.png'
import facebook from '../images/facebook.png'
import telegram from '../images/telegram.png'


export default function HomePage() {
  return (
    <>
      <Navbar />
      <FadeInSection>
        <section className="main-section">
          <div className="home-content">
            <h1>ClimaCode — measure and reduce the carbon of digital and real-world activities</h1>
            <p>Calculate your carbon footprint and get recommendations on how to reduce emissions.</p>
            <a href="#"><button>Start Scanning</button></a>
          </div>
          <div>
            <img src={mainImage} alt="main image" className="home-image"/>
          </div>
        </section>
      </FadeInSection>
      <FadeInSection>
        <section className="why-us-section">
          <h1 className="why-us-title">Why ClimaCode?</h1>
            <div className = "why-us-cards">
              <AboutCard image={card1} title="Real-Time Carbon Tracking" description="Monitor the CO2
    impact of your browsing, streaming, and cloud usage" />
              <AboutCard image={card2} title="Detailed Insights" description="Understand exactly where your digital carbon emissions come from" />
              <AboutCard image={card3} title="Actionable Tips" description="Get tailored recommendations to reduce your carbon footprint" />
          </div>
        </section>
      </FadeInSection>
      <FadeInSection>
        <div className="line"></div>
      </FadeInSection>
      <FadeInSection>
        <section className="about-section">
          <h1 className="about-title">About Us</h1>
          <p className="about-description">Our team was established in 2024. We work on technological and social projects, participated and won in international competitions, implemented several significant initiatives.</p>
          <div className="about-cards">
          <AboutUs image={member1} name="Maidankhan Adilet"/>
          <AboutUs image={member2} name="Maidan Adiya"/>
          </div>
        </section>
      </FadeInSection>
      <FadeInSection>
        <div className="line"></div>
      </FadeInSection>
      <FadeInSection>
        <section className="footer-section">

          <div className="footer-nav">
            <h1>Navigation</h1>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">ClimaScan</a></li>
              <li><a href="#">EcoDev School</a></li>
              <li><a href="#">ClimaOffset</a></li>
            </ul>
          </div>

          <div className="footer-contacts">
            <h1>Contacts</h1>
            <ul>
              <li><img src={emailIcon} alt="Email Icon" /><p>Email: climacode@gmail.com</p></li>
              <li><img src={locationIcon} alt="Location Icon" /><p>Almaty, Kazakhstan</p></li>
              <li><img src={linkedinIcon} alt="Linkedin Icon" /><p>Linkedin: ClimaCode.kz</p></li>
              <li><img src={githubIcon} alt="Github Icon" /><p>GitHub: github.com/climacode</p></li>
            </ul>
          </div>
        </section>
        </FadeInSection>
        <FadeInSection>
          <section className="socials-section">
            <div className="social-icons">
              <a href="#"><img src={instagram} alt="Instagram Icon" /></a>
              <a href="#"><img src={facebook} alt="Facebook Icon" /></a>
              <a href="#"><img src={telegram} alt="Telegram Icon" /></a>
            </div>
            <p>Ⓒ 2025 ClimaCode.kz. Developed with care for the planet</p>
          </section>
        </FadeInSection>
    </>
  )
}