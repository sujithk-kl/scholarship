import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ImageCarousel = () => {
    const { t } = useTranslation();
    const slides = [
        {
            url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2070&auto=format&fit=crop", // Student Reading
            title: "Empowering Students",
            subtitle: "Scholarships to help you excel as a life-long learner."
        },
        {
            url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop", // Indian College Students
            title: "Higher Education for All",
            subtitle: "Ensuring no student is left behind due to financial constraints."
        },
        {
            url: "/assets/banner3.png",
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
        }, 4000);

        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="relative h-[28rem] md:h-[32rem] w-full m-auto group overflow-hidden bg-black">
            <div className="w-full h-full relative">
                <img
                    src={slides[currentIndex].url}
                    alt={slides[currentIndex].title}
                    className="w-full h-full object-cover duration-500 transition-all ease-in-out opacity-60"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-down drop-shadow-lg">
                        {t(slides[currentIndex].title)}
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl drop-shadow-md">
                        {t(slides[currentIndex].subtitle)}
                    </p>
                    <Link to="/login" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse shadow-lg hover:bg-red-700 transition-colors">
                        {t("Applications Open Now")}
                    </Link>
                </div>
            </div>

            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-all">
                <ChevronLeft onClick={prevSlide} size={30} />
            </div>

            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-all">
                <ChevronRight onClick={nextSlide} size={30} />
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center py-2 gap-2">
                {slides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => setCurrentIndex(slideIndex)}
                        className={`text-2xl cursor-pointer transition-all duration-300 h-3 w-3 rounded-full ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
