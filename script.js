let userInput = document.getElementById("userInput");
let sendBtn = document.getElementById("sendBtn");
let voiceBtn = document.getElementById("voiceBtn");
let chatContainer = document.getElementById("chatContainer");

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

let lastResponse = ""; // Variable to store the last AI response
let API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC6VcUbEvNIZAuouO0ss_86pLHksbbGSbw";

function createChatBox(content, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.innerText = content;
    return div;
}

function speak(text) {  m
    let textToSpeak = new SpeechSynthesisUtterance(text);
    textToSpeak.lang = "en-GB";
    window.speechSynthesis.speak(textToSpeak);
}

// Handle voice input
voiceBtn.addEventListener("click", () => {
    recognition.start();
    recognition.onresult = (event) => {
        let currentIndex = event.resultIndex;
        let transcript = event.results[currentIndex][0].transcript;
        handleUserMessage(transcript);
    };
});

// Handle text input and button click
sendBtn.addEventListener("click", () => {
    let message = userInput.value.trim();
    if (message) {
        handleUserMessage(message);
        userInput.value = ""; // Clear input
    }
});

// Handle "Enter" key press for submitting the prompt
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default action
        let message = userInput.value.trim();
        if (message) {
            handleUserMessage(message);
            userInput.value = ""; // Clear input
        }
    }
});

// Function to handle user message
function handleUserMessage(message) {
    // Create user chat box
    chatContainer.appendChild(createChatBox(message, "user-chat-box"));

    // Check if the message is a greeting
    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
        speak("Hello, what can I do for you?");
    }

    // Check for "open google" command
    if (message.toLowerCase().includes("open google")) {
        speak("Opening Google");
        window.open("https://www.google.com", "_blank"); // Open Google in new tab
        return;
    }

    // Check for "open youtube" command
    if (message.toLowerCase().includes("open youtube")) {
        speak("Opening YouTube");
        window.open("https://www.youtube.com", "_blank"); // Open YouTube in new tab
        return;
    }

    // Check for "open facebook" command
    if (message.toLowerCase().includes("open facebook")) {
        speak("Opening Facebook");
        window.open("https://www.facebook.com", "_blank"); // Open Facebook in new tab
        return;
    }

    // Check for "open whatsapp" command
    if (message.toLowerCase().includes("open whatsapp")) {
        speak("Opening WhatsApp");
        window.open("https://web.whatsapp.com", "_blank"); // Open WhatsApp Web in new tab
        return;
    }

    // Check for "what's the time" or "tell me the time"
    if (message.toLowerCase().includes("time")) {
        let currentTime = new Date().toLocaleTimeString(); // Get the current time
        speak(`The time is ${currentTime}`);
        chatContainer.appendChild(createChatBox(`The time is ${currentTime}`, "ai-chat-box"));
        return;
    }

    // Check for "what's the date" or "tell me the date"
    if (message.toLowerCase().includes("date")) {
        let currentDate = new Date().toLocaleDateString(); // Get the current date
        speak(`Today's date is ${currentDate}`);
        chatContainer.appendChild(createChatBox(`Today's date is ${currentDate}`, "ai-chat-box"));
        return;
    }

    // Check for "what's the day today" or "tell me the day"
    if (message.toLowerCase().includes("day")) {
        let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let currentDay = daysOfWeek[new Date().getDay()]; // Get the current day
        speak(`Today is ${currentDay}`);
        chatContainer.appendChild(createChatBox(`Today is ${currentDay}`, "ai-chat-box"));
        return;
    }
       // Check for "name"
    if (message.toLowerCase().includes("name")) {
        const response = "I am Genie, A Virtual Assistant Created by Faris Shaikh and team.";
        speak(response);
        chatContainer.appendChild(createChatBox(response, "ai-chat-box"));
        return;
    }

    if (message.toLowerCase().includes("previous day") || message.toLowerCase().includes("next day") ||
        message.toLowerCase().includes("previous date") || message.toLowerCase().includes("next date")) {
        handlePreviousNextDayDate(message.toLowerCase());
        return;
    }

    // Call the API for other responses
    if (!lastResponse || lastResponse !== message) {
        fetchResponse(message);
    }
}

// Function to fetch AI response
async function fetchResponse(message) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    "role": "user",
                    "parts": [{ text: message }]
                }]
            })
        });
        const data = await response.json();
        const apiResponse = data?.candidates[0].content.parts[0].text.trim();
        lastResponse = apiResponse; // Store the last response to avoid repetition

        // Create AI chat box
        chatContainer.appendChild(createChatBox(apiResponse, "ai-chat-box"));

        // Optionally speak the response if needed
        // You can uncomment the line below if you want the AI to speak the response
        // speak(apiResponse);

        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
    } catch (error) {
        console.log(error);
    }
}
