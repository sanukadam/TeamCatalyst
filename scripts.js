// Smooth scroll to the highlights section
document.querySelector('.cta-button').addEventListener('click', function(e) {
    e.preventDefault();
    const highlightsSection = document.getElementById('highlights-section');
    if (highlightsSection) {
        highlightsSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// Mood categories for dynamic content
const categories = {
    positive: "You are feeling upbeat! Here are some trailers to match your positive energy.",
    neutral: "In a balanced state of mind? These trailers reflect a more neutral mood.",
    negative: "Feeling the drama or intensity? These trailers will tap into those emotions."
};

// Function to display content based on mood
function showHighlight(genre) {
    const highlightContent = document.querySelector('.highlight-content');
    
    if (categories[genre]) {
        highlightContent.innerHTML = `<h2>${genre.charAt(0).toUpperCase() + genre.slice(1)} Mood</h2><p>${categories[genre]}</p>`;
        highlightContent.classList.add('show');
    } else {
        highlightContent.innerHTML = "<p>No trailers available for this mood.</p>";
    }

let moviesData = [];

// Array of unique images to use as backgrounds for the movie cards
const imageUrls = [
    "image-url-1.jpg", "image-url-2.jpg", "image-url-3.jpg", 
    "image-url-4.jpg", "image-url-5.jpg", "image-url-6.jpg",
    // Add more image URLs as needed
];

function fetchData() {
    Papa.parse("sentiment_movie_dataset.csv", {
        download: true,
        header: true,
        complete: function (results) {
            moviesData = results.data; // Store parsed data in moviesData
        },
        error: function (error) {
            console.error("Error fetching the CSV file:", error);
        },
    });
}

function showDataset(sentiment) {
    const datasetCards = document.getElementById(`${sentiment}-dataset`);
    datasetCards.innerHTML = ''; // Clear previous data

    // Filter data based on sentiment score > 50
    const filteredMovies = moviesData.filter(movie => {
        const positiveScore = parseFloat(movie["Positive Sentiment"]);
        const negativeScore = parseFloat(movie["Negative Sentiment"]);
        const neutralScore = parseFloat(movie["Neutral Sentiment"]);

        if (sentiment === 'positive') {
            return positiveScore > 50;
        } else if (sentiment === 'negative') {
            return negativeScore > 10;
        } else if (sentiment === 'neutral') {
            return neutralScore > 10;
        }
        return false;
    });

    // Populate the cards with filtered data
    filteredMovies.forEach((movie, index) => {
        // Cycle through the image URLs if there are more movies than images
        const movieImage = imageUrls[index % imageUrls.length];

        const card = `<div class="movie-card" style="background-image: url('${movieImage}')">
            <div class="card-overlay">
                <h4>${movie["Movie Title"]}</h4>
                <p><strong>Genre:</strong> ${movie["Genre"]}</p>
                <p><strong>Sentiment Score:</strong> ${movie["Sentiment Score"]}</p>
                <p><strong>Review Count:</strong> ${movie["Review Count"]}</p>
            </div>
        </div>`;
        datasetCards.innerHTML += card;
    });

    datasetCards.style.display = 'flex'; // Show the dataset section for the sentiment type
}
}
// Event listeners for mood cards
const moodCards = document.querySelectorAll('.mood-card');
moodCards.forEach(card => {
    card.addEventListener('click', function() {
        const genre = this.getAttribute('data-genre');
        showHighlight(genre);
    });
});
