import { useEffect, useState } from "react";
import { Globe, X, Minimize } from "lucide-react";

const GoogleTranslateWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const addScript = () => {
            const script = document.createElement("script");
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        };

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                { pageLanguage: "en", autoDisplay: false },
                "google_translate_element"
            );
        };

        addScript();
    }, []);

    // Function to reinitialize Google Translate when modal opens
    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(() => {
            if (document.getElementById("google_translate_element").innerHTML.trim() === "") {
                new window.google.translate.TranslateElement(
                    { pageLanguage: "en", autoDisplay: false },
                    "google_translate_element"
                );
            }
        }, 100);
    };

    return (
        <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end">
            {/* Language Selection Modal */}
            {isOpen && (
                <div className="mb-4 w-64 bg-white rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-medium">Select Language</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
                                <Minimize size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    <div id="google_translate_element" className="mt-2"></div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={handleOpen}
                className={`${
                    isOpen ? "hidden" : "flex"
                } bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 items-center justify-center shadow-lg transition-all`}
                aria-label="Open language selector"
            >
                <Globe size={24} />
            </button>
        </div>
    );
};

export default GoogleTranslateWidget;
