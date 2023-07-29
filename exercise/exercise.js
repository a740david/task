// Get references to the frame and file input element
const frame = document.getElementById("frame");
const fileInput = document.getElementById("fileInput");
const thumbnailWidth = 100; // Width of the thumbnail
const thumbnailHeight = 100; // Height of the thumbnail


// Array to store thumbnail elements
const thumbnails = [];

// Variable to store the currently selected thumbnail
let selectedThumbnail = null;


// Add an event listener to the file input
fileInput.addEventListener("change", function (event) {
  // Check if a file was selected
  if (event.target.files.length > 0) {
    
    for (const file of event.target.files) {
      // Create a FileReader to read the file
      const reader = new FileReader();

      // Set up the onload event to create a thumbnail and add it to the frame
      reader.onload = function (e) {
        // Create a wrapper element for the thumbnail
        const wrapper = document.createElement("div");
        wrapper.classList.add("thumbnail-wrapper");

        // Keep trying to find a non-overlapping position for the thumbnail
        let randomX, randomY;
        do {
          randomX = getRandomPosition(frame.offsetWidth - thumbnailWidth);
          randomY = getRandomPosition(frame.offsetHeight - thumbnailHeight);
        } while (hasCollision(randomX, randomY));

        // Mark the position as taken by adding it to the collision array
        collisions.push({ x: randomX, y: randomY });

        
        // Set the position of the thumbnail
        wrapper.style.left = randomX + "px";
        wrapper.style.top = randomY + "px";

        // Create the thumbnail image
        const thumbnailImage = new Image();
        thumbnailImage.src = e.target.result;
        thumbnailImage.classList.add("thumbnail"); // Apply the thumbnail class

        // Append the thumbnail image to the wrapper and then the wrapper to the frame
        wrapper.appendChild(thumbnailImage);
        frame.appendChild(wrapper);

        // Store the thumbnail element in the thumbnails array
        thumbnails.push(wrapper);

        // Add event listener for moving the thumbnail by clicking on it
        wrapper.addEventListener("click", function () {
          selectThumbnail(wrapper);
        });
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  }
});

// Function to get a random position for the thumbnail (within the frame)
function getRandomPosition(max) {
  return Math.floor(Math.random() * max);
}

// Array to store collision positions
const collisions = [];

// Function to check for collisions with existing thumbnails
function hasCollision(x, y) {
  for (const thumbnail of thumbnails) {
    if (thumbnail !== selectedThumbnail) {
      const thumbLeft = parseInt(thumbnail.style.left, 10) || 0;
      const thumbTop = parseInt(thumbnail.style.top, 10) || 0;

      const dx = Math.abs(x - thumbLeft);
      const dy = Math.abs(y - thumbTop);

      if (dx < thumbnailWidth && dy < thumbnailHeight) {
        return true;
      }
    }
  }
    return false ;
    
}

// Function to select a specific thumbnail for moving
function selectThumbnail(thumbnail) {
  if (selectedThumbnail === thumbnail) {
    // If the thumbnail is already selected, deselect it
    thumbnail.style.border = "none";
    selectedThumbnail = null;
    document.removeEventListener("keydown", moveThumbnailByKey);
  } else {
    // Deselect the previous selected thumbnail, if any
    if (selectedThumbnail) {
      selectedThumbnail.style.border = "none";
      document.removeEventListener("keydown", moveThumbnailByKey);
    }

    // Select the new thumbnail for movement
    selectedThumbnail = thumbnail;
    selectedThumbnail.style.border = "2px solid red";
    document.addEventListener("keydown", moveThumbnailByKey);
  }


}

// Function to move the selected thumbnail based on keyboard arrow keys
function moveThumbnailByKey(event) {
  
  const key = event.key;
  const moveDistance = 10; // The distance to move the thumbnail on each arrow key press

  if (key === "ArrowUp") {
    moveSelectedThumbnail(0, -moveDistance); // Move up
  } else if (key === "ArrowDown") {
    moveSelectedThumbnail(0, moveDistance); // Move down
  } else if (key === "ArrowLeft") {
    moveSelectedThumbnail(-moveDistance, 0); // Move left
  } else if (key === "ArrowRight") {
    moveSelectedThumbnail(moveDistance, 0); // Move right
  }
}

// Function to move a specific thumbnail by dx and dy
function moveThumbnail(thumbnail, dx, dy) {
  const left = parseInt(thumbnail.style.left, 10) || 0;
  const top = parseInt(thumbnail.style.top, 10) || 0;
  const newLeft = left + dx;
  const newTop = top + dy;
  if (isWithinFrame(newLeft, newTop)) {
    thumbnail.style.left = newLeft + "px";
    thumbnail.style.top = newTop + "px";
  }
}

// Function to check if the given position is within the frame
function isWithinFrame(x, y) {
  return (
    x >= 0 &&
    x + thumbnailWidth <= frame.offsetWidth &&
    y >= 0 &&
    y + thumbnailHeight <= frame.offsetHeight
  );
}

 // Function to move the selected thumbnail by dx and dy
 function moveSelectedThumbnail(dx, dy) {
  if (selectedThumbnail) {
    const left = parseInt(selectedThumbnail.style.left, 10) || 0;
    const top = parseInt(selectedThumbnail.style.top, 10) || 0;
    const newLeft = left + dx;
    const newTop = top + dy;

    // Check for collisions with other thumbnails
    if (!hasCollision(newLeft, newTop)) {
      // Check if the new position goes beyond the frame boundaries
      if (
        newLeft >= 0 &&
        newTop >= 0 &&
        newLeft + thumbnailWidth <= frame.offsetWidth &&
        newTop + thumbnailHeight <= frame.offsetHeight
      ) {
        selectedThumbnail.style.left = newLeft + "px";
        selectedThumbnail.style.top = newTop + "px";
      }
    }
  }
}