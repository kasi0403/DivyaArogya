import { useEffect, useState, useRef } from "react";
import { Globe, X, Minimize } from "lucide-react";

const GoogleTranslateWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const dropdownRef = useRef(null);

    // Available languages
    const languages = [
        { code: "en", name: "English" },
        { code: "hi", name: "Hindi" },
        { code: "te", name: "Telugu" },
        { code: "ta", name: "Tamil" },
        { code: "kn", name: "Kannada" },
        { code: "mr", name: "Marathi" },
        { code: "bn", name: "Bengali" },
        { code: "gu", name: "Gujarati" },
        { code: "ml", name: "Malayalam" }
    ];

    // Load Google Translate Script
    const loadGoogleTranslateScript = () => {
        const script = document.createElement("script");
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                { pageLanguage: "en", autoDisplay: false },
                "google_translate_element"
            );
        };
    };

    // Change language function
    const changeLanguage = (langCode, langName) => {
        setSelectedLanguage(langName);
        const googleFrame = document.querySelector(".goog-te-combo");
        if (googleFrame) {
            googleFrame.value = langCode;
            googleFrame.dispatchEvent(new Event("change"));
        }
        setIsOpen(false);
    };

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        loadGoogleTranslateScript();
    }, []);

    return (
        <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end" ref={dropdownRef}>
            {/* Language Selection Modal */}
            {isOpen && (
                <div className="mb-4 w-64 bg-white rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-medium text-gray-700">Select Language</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="mt-2 max-h-64 overflow-y-auto">
                        {languages.map((lang) => (
                            <div
                                key={lang.code}
                                className="p-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => changeLanguage(lang.code, lang.name)}
                            >
                                {lang.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${
                    isOpen ? "hidden" : "flex"
                } bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 items-center justify-center shadow-lg transition-all`}
                aria-label="Open language selector"
            >
                <Globe size={24} />
            </button>

            {/* Hidden Google Translate Widget */}
            <div id="google_translate_element" style={{ display: "none" }}></div>
        </div>
    );
};

export default GoogleTranslateWidget;