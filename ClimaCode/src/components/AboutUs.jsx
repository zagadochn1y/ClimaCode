import "../styles/about-us.css";

export default function AboutUs({ image, name }) {
    return (
        <div className="about-us-card">
            <img src={image} alt="AboutUs Member" />
            <h2>{name}</h2>
        </div>
    )
}

