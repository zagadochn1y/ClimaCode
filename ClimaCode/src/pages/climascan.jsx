import FadeInSection from "../components/FadeInSection";
import Navbar from "../components/navbar";

export default function ClimaScan() {
    return (
        <>
            <Navbar />
            <FadeInSection>
                <section className="climascan-section">
                    <h1>ClimaScan — site audit & CO₂ calculator</h1>
                    <p>Enter a website URL to run a full audit. You’ll get CO₂ per visit, year and your sustainable score.</p>
                        
                </section>    
            </FadeInSection>
            
        </>
    )
}