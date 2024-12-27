let currentIndex = 0;
const letters = document.querySelectorAll('.letter');
const objectImage = document.getElementById('object-image');
const animationText = document.getElementById('animation-text');

function showCurrentLetter() {
    letters.forEach((letter, index) => {
        if (index === currentIndex) {
            letter.classList.remove('hidden');
            const selectedLetter = letter.getAttribute('data-letter');
            const word = letter.getAttribute('data-word');
            
            // Play animation and speak the letter and word
            playAnimation(selectedLetter, word);
            speakText(`${selectedLetter} for ${word}`);
        } else {
            letter.classList.add('hidden');
        }
    });
}

function playAnimation(letter, word) {
    animationText.textContent = `${letter} for ${word}`;
    loadImage(word.toLowerCase())
        .then((src) => {
            objectImage.src = src;
            objectImage.alt = word;
            objectImage.classList.remove('hidden');

            // Optional zoom effect
            objectImage.style.transform = 'scale(1)';
            setTimeout(() => {
                objectImage.style.transform = 'scale(1.2)';
            }, 100);
        })
        .catch(() => {
            animationText.textContent = `Image not available for ${word}`;
            objectImage.classList.add('hidden');
        });
}

function loadImage(word) {
    return new Promise((resolve, reject) => {
        const jpegPath = `${word}.jpeg`;
        const pngPath = `${word}.png`;

        const img = new Image();
        img.onload = () => resolve(jpegPath);
        img.onerror = () => {
            img.src = pngPath;
            img.onload = () => resolve(pngPath);
            img.onerror = () => reject();
        };
        img.src = jpegPath;
    });
}

function speakText(text) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new speech instance
    const msg = new SpeechSynthesisUtterance(text);
    
    // Set speech rate for faster output
    msg.rate = 1.3; // Adjust this value (default is 1, range is 0.1 to 10)
    
    // Speak the text
    window.speechSynthesis.speak(msg);
}

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentIndex < letters.length - 1) {
        currentIndex++;
        showCurrentLetter();
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        showCurrentLetter();
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    currentIndex = 0;
    showCurrentLetter();
});

// Initialize the first letter
showCurrentLetter();
