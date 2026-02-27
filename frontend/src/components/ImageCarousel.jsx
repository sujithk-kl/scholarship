import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ImageCarousel = () => {
    const { t } = useTranslation();
    const slides = [
        {
            url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop", // University building / campus
            title: "Empowering Students",
            subtitle: "Scholarships to help you excel as a life-long learner."
        },
        {
            url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop", // Students studying together
            title: "Higher Education for All",
            subtitle: "Ensuring no student is left behind due to financial constraints."
        },
        {
            url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop", // Graduation celebration
            title: "Simple 3-Step Process",
            subtitle: "Register, Apply, and Receive Scholarship directly in your account."
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
        }, 5000); // Slightly slower for a more premium, unhurried feel

        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="container mx-auto px-4 md:px-6 relative group overflow-hidden z-10">
            {/* 
              Padding/rounding makes it look like a framed hero section instead of edge-to-edge.
              This is a hallmark of premium Apple-like design (cards floating on the background).
            */}
            <div className="relative h-[24rem] md:h-[36rem] w-full m-auto rounded-[2rem] overflow-hidden shadow-2xl bg-gray-900 border border-gray-200/20">
                <div className="w-full h-full relative">
                    <img
                        src={slides[currentIndex].url}
                        alt={slides[currentIndex].title}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-105"
                    />

                    {/* Dark gradient overlay for text readability without losing the image context */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    {/* Overlay Content */}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center p-8 md:p-16 z-20">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg leading-tight animate-fade-in-up">
                            {t(slides[currentIndex].title)}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-medium drop-shadow-md opacity-90 delay-100 animate-fade-in-up">
                            {t(slides[currentIndex].subtitle)}
                        </p>
                        <Link to="/login" className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-3.5 rounded-full text-base font-bold shadow-xl hover:shadow-white/20 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 mb-2">
                            {t("Applications Open Now")}
                        </Link>
                    </div>
                </div>

                {/* Navigation Arrows - Using backdrop blur and softer styling */}
                <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={prevSlide} className="p-3 rounded-full backdrop-blur-md bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300 focus:outline-none">
                        <ChevronLeft size={24} />
                    </button>
                </div>

                <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={nextSlide} className="p-3 rounded-full backdrop-blur-md bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300 focus:outline-none">
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Pagination Indicators Container */}
                <div className="absolute top-6 left-0 right-0 flex justify-center py-2 gap-3 z-30">
                    {slides.map((slide, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={() => setCurrentIndex(slideIndex)}
                            className={`transition-all duration-500 rounded-full focus:outline-none ${currentIndex === slideIndex
                                ? 'w-10 h-1.5 bg-white shadow-md'
                                : 'w-2 h-1.5 bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${slideIndex + 1}`}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageCarousel;
