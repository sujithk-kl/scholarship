import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Home": "Home",
            "About Us": "About Us",
            "Schemes": "Schemes",
            "Institutes": "Institutes",
            "Officers": "Officers",
            "Public Details": "Public Details",
            "Crowdfunding": "Crowdfunding",
            "Login": "Login",
            "Register": "Register",
            "Smart Scholarship Management System": "Smart Scholarship Management System",
            "Students": "Students",
            "Institutions": "Institutions",
            "Public": "Public",
            "Announcements": "Announcements",
            "Get your OTR": "Get your OTR",
            "Apply now!": "Apply now!",
            "COLLEGE SCHOLARSHIP PORTAL": "COLLEGE SCHOLARSHIP PORTAL",
            "STUDENT SERVICES DIVISION": "STUDENT SERVICES DIVISION",
            "Skip to Main Content": "Skip to Main Content",
            "Screen Reader Access": "Screen Reader Access",
            "Student Welfare Department, College Administration": "Student Welfare Department, College Administration",
            "Welcome": "Welcome",
            "Logout": "Logout",
            "AI Matches": "AI Matches",
            "announcement_1": "Application form of the candidate is fixed as Rs 30.00 (inclusive of all applicable taxes, etc.). To locate the nearest CSC please visit the link",
            "announcement_2": "Dear Student - If you are getting error 901 while doing face authentication, kindly update UIDAI AadhaarFaceRD App from Playstore.",
            "View more": "View more",
            "otr_1": "One Time Registration (OTR) is a unique 14-digit number issued based on the Aadhaar/Aadhaar Enrolment ID (EID) and is applicable for the entire academic career of the student.",
            "otr_2": "OTR simplifies the scholarship application process thereby eliminating the need of registration in each academic year.",
            "otr_3": "OTR is required to apply for scholarship on Smart Scholarship Portal.",
            "Bridging the gap between ambitious students and educational opportunities.": "Bridging the gap between ambitious students and educational opportunities.",
            "2026 Final Year Project. Designed & Developed by": "2026 Final Year Project. Designed & Developed by",
            "[Your Name/Team]": "[Your Name/Team]",
            "Computer Engineering Department": "Computer Engineering Department",
            "Empowering Students": "Empowering Students",
            "Scholarships to help you excel as a life-long learner.": "Scholarships to help you excel as a life-long learner.",
            "Higher Education for All": "Higher Education for All",
            "Ensuring no student is left behind due to financial constraints.": "Ensuring no student is left behind due to financial constraints.",
            "Simple 3-Step Process": "Simple 3-Step Process",
            "Register, Apply, and Receive Scholarship directly in your account.": "Register, Apply, and Receive Scholarship directly in your account.",
            "Applications Open Now": "Applications Open Now"
        }
    },
    ta: {
        translation: {
            "Home": "முகப்பு",
            "About Us": "எங்களை பற்றி",
            "Schemes": "திட்டங்கள்",
            "Institutes": "நிறுவனங்கள்",
            "Officers": "அதிகாரிகள்",
            "Public Details": "பொது விவரங்கள்",
            "Crowdfunding": "கூட்டு நிதி",
            "Login": "உள்நுழைக",
            "Register": "பதிவு செய்க",
            "Smart Scholarship Management System": "ஸ்மார்ட் உதவித்தொகை மேலாண்மை அமைப்பு",
            "Students": "மாணவர்கள்",
            "Institutions": "நிறுவனங்கள்",
            "Public": "பொது",
            "Announcements": "அறிவிப்புகள்",
            "Get your OTR": "உங்கள் OTR ஐப் பெறுங்கள்",
            "Apply now!": "இப்போது விண்ணப்பிக்கவும்!",
            "COLLEGE SCHOLARSHIP PORTAL": "கல்லூரி உதவித்தொகை போர்டல்",
            "STUDENT SERVICES DIVISION": "மாணவர் சேவைகள் பிரிவு",
            "Skip to Main Content": "முதன்மை உள்ளடக்கத்திற்குச் செல்",
            "Screen Reader Access": "ஸ்கிரீன் ரீடர் அணுகல்",
            "Student Welfare Department, College Administration": "மாணவர் நலத்துறை, கல்லூரி நிர்வாகம்",
            "Welcome": "வரவேற்கிறோம்",
            "Logout": "வெளியேறு",
            "AI Matches": "AI பொருத்தங்கள்",
            "announcement_1": "விண்ணப்பதாரரின் விண்ணப்பப் படிவக் கட்டணம் ரூ. 30.00 (அனைத்து வரிகளும் உட்பட). அருகில் உள்ள CSC-ஐ கண்டறிய, இந்த இணைப்பைப் பார்வையிடவும்",
            "announcement_2": "அன்புள்ள மாணவரே - முகம் வழியான அங்கீகாரத்தின் போது பிழை 901 ஏற்பட்டால், பிளேஸ்டோரில் இருந்து UIDAI AadhaarFaceRD செயலியைப் புதுப்பிக்கவும்.",
            "View more": "மேலும் பார்க்க",
            "otr_1": "ஒருமுறை பதிவு (OTR) என்பது ஆதார்/ஆதார் பதிவு எண் (EID) அடிப்படையில் வழங்கப்படும் தனித்துவமான 14 இலக்க எண்ணாகும், இது மாணவரின் முழு கல்வி வாழ்க்கைக்கும் பொருந்தும்.",
            "otr_2": "OTR உதவித்தொகை விண்ணப்ப செயல்முறையை எளிதாக்குகிறது, இதன் மூலம் ஒவ்வொரு கல்வியாண்டிலும் பதிவு செய்ய வேண்டிய தேவையை நீக்குகிறது.",
            "otr_3": "ஸ்மார்ட் ஸ்காலர்ஷிப் போர்ட்டலில் உதவித்தொகைக்கு விண்ணப்பிக்க OTR தேவை.",
            "Bridging the gap between ambitious students and educational opportunities.": "லட்சிய மாணவர்களுக்கும் கல்வி வாய்ப்புகளுக்கும் இடையிலான இடைவெளியைக் குறைக்கிறது.",
            "2026 Final Year Project. Designed & Developed by": "2026 இறுதி ஆண்டு திட்டம். வடிவமைத்து உருவாக்கியவர்கள்",
            "[Your Name/Team]": "[உங்கள் பெயர்/குழு]",
            "Computer Engineering Department": "கணினி பொறியியல் துறை",
            "Empowering Students": "மாணவர்களை மேம்படுத்துதல்",
            "Scholarships to help you excel as a life-long learner.": "வாழ்நாள் முழுவதும் கற்பவராக சிறந்து விளங்க உதவும் உதவித்தொகைகள்.",
            "Higher Education for All": "அனைவருக்கும் உயர்கல்வி",
            "Ensuring no student is left behind due to financial constraints.": "நிதி நெருக்கடியால் எந்த மாணவரும் பின்தங்கவில்லை என்பதை உறுதி செய்தல்.",
            "Simple 3-Step Process": "எளிய 3-படி செயல்முறை",
            "Register, Apply, and Receive Scholarship directly in your account.": "பதிவுசெய்து, விண்ணப்பித்து, உதவித்தொகையை நேரடியாக உங்கள் கணக்கில் பெறுங்கள்.",
            "Applications Open Now": "விண்ணப்பங்கள் இப்போது திறக்கப்பட்டுள்ளன"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
