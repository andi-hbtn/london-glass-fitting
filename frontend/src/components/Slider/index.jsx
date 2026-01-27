import { useState, useEffect } from "react";
import "./index.css";
import hs1 from "../../images/hs1.avif"
import hs2 from "../../images/hs2.avif"
import hs3 from "../../images/hs3.avif"
const Slider = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    // Slider data
    const sliderItems = [
        {
            title: "Premium Glass Collections",
            subtitle: "Discover our exquisite range of glass solutions",
            description: "Crafted with precision and elegance for discerning clients",
            image: hs1
        },
        {
            title: "Architectural Excellence",
            subtitle: "Transform spaces with our glass innovations",
            description: "Custom solutions for modern buildings and interiors",
            image: hs2
        },
        {
            title: "Luxury Glass Solutions",
            subtitle: "Where clarity meets craftsmanship",
            description: "Experience the perfect blend of form and function",
            image: hs3
        }
    ];

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % sliderItems.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [sliderItems.length]);

    const goToSlide = (index) => {
        setActiveIndex(index);
    };

    const goToPrevSlide = () => {
        setActiveIndex(activeIndex === 0 ? sliderItems.length - 1 : activeIndex - 1);
    };

    const goToNextSlide = () => {
        setActiveIndex((activeIndex + 1) % sliderItems.length);
    };

    return (
        <div className="collection-slider">
            <div className="slider-inner" style={{ backgroundImage: `url(${sliderItems[activeIndex].image})` }}>
                <div className="slider-content">
                    <div className="slider-text">
                        <h2>{sliderItems[activeIndex].title}</h2>
                        <p className="subtitle">{sliderItems[activeIndex].subtitle}</p>
                        <p className="description">{sliderItems[activeIndex].description}</p>
                        <div className="divider"></div>
                    </div>
                </div>
            </div>

            <div className="slider-controls">
                <button className="slider-arrow prev" onClick={goToPrevSlide}>
                    <span>‹</span>
                </button>

                <div className="slider-pagination">
                    {sliderItems.map((_, index) => (
                        <button
                            key={index}
                            className={`pagination-dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <button className="slider-arrow next" onClick={goToNextSlide}>
                    <span>›</span>
                </button>
            </div>
        </div>

    )
}

export default Slider;