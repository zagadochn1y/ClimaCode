import '../styles/about.css'

export default function AboutCard({ image, title, description }) {
    return (
        <div className = "about-card">
            <img src={image} alt="CardImage"/>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}