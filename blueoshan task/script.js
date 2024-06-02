document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const modal = document.getElementById('modal');
    const errorModal = document.getElementById('errorModal');
    const saveButton = document.getElementById('saveButton');
    const closeButton = document.getElementById('closeButton');
    const closeErrorButton = document.getElementById('closeErrorButton');
    const createButton = document.getElementById('createButton');
    const savedDataContainer = document.querySelector('.savedData');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');

    // Variables to track edit mode and the current card being edited
    let editMode = false;
    let currentCard = null;

    // Utility function to toggle modal visibility
    const toggleModal = (modal, show) => {
        if (show) {
            modal.showModal(); // Show modal
        } else {
            modal.close(); // Hide modal
        }
        document.body.classList.toggle('modal-open', show); // Toggle body class to prevent scrolling
    };

    // Utility function to show error modal with a message
    const showErrorModal = message => {
        document.getElementById('errorMessage').innerText = message; // Set error message
        errorModal.style.display = 'block'; // Display error modal
    };

    // Utility function to hide error modal
    const hideErrorModal = () => {
        errorModal.style.display = 'none'; // Hide error modal
    };

    // Function to save form data
    const saveForm = () => {
        const title = titleInput.value;
        const description = descriptionInput.value;

        // Validate inputs
        if (!title || !description) {
            return showErrorModal('Please fill in all fields.'); // Show error if inputs are empty
        }

        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        if (editMode && currentCard) {
            // Edit existing card
            currentCard.querySelector('.card-title').innerText = title;
            currentCard.querySelector('.card-description').innerText = description;
            const index = Array.from(savedDataContainer.children).indexOf(currentCard);
            notes[index] = { title, description };
        } else {
            // Create new card
            const card = createCard(title, description);
            savedDataContainer.appendChild(card);
            notes.push({ title, description });
        }

        localStorage.setItem('notes', JSON.stringify(notes)); // Save notes to localStorage
        clearForm(); // Clear form fields
        toggleModal(modal, false); // Hide modal
    };

    // Function to create a card element
    const createCard = (title, description) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-content">
                <h3 class="card-title">${title}</h3>
                <p class="card-description">${description}</p>
                <i class="fa fa-ellipsis-vertical" onclick="toggleDropdown(event)"></i>
                <div class="dropdown-content">
                    <button onclick="editCard(this)">Edit</button>
                    <button onclick="deleteCard(this)">Delete</button>
                </div>
            </div>
        `;
        return card;
    };

    // Function to toggle dropdown menu visibility
    window.toggleDropdown = event => {
        event.stopPropagation();
        const dropdown = event.target.nextElementSibling;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    };

    // Function to enable edit mode and populate form with card data
    window.editCard = button => {
        const card = button.closest('.card');
        titleInput.value = card.querySelector('.card-title').innerText;
        descriptionInput.value = card.querySelector('.card-description').innerText;
        editMode = true;
        currentCard = card;
        toggleModal(modal, true); // Show modal with current card data
    };

    // Function to delete a card
    window.deleteCard = button => {
        const card = button.closest('.card');
        card.remove();
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const index = Array.from(savedDataContainer.children).indexOf(card);
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes)); // Update localStorage
    };

    // Function to load saved notes from localStorage on page load
    const loadSavedNotes = () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(note => {
            const card = createCard(note.title, note.description);
            savedDataContainer.appendChild(card);
        });
    };

    // Function to clear form fields and reset edit mode
    const clearForm = () => {
        titleInput.value = '';
        descriptionInput.value = '';
        editMode = false;
        currentCard = null;
    };

    // Event listeners
    createButton.addEventListener('click', () => toggleModal(modal, true)); // Show modal on create button click
    closeButton.addEventListener('click', () => toggleModal(modal, false)); // Hide modal on close button click
    saveButton.addEventListener('click', saveForm); // Save form data on save button click
    closeErrorButton.addEventListener('click', hideErrorModal); // Hide error modal on close button click

    // Prevent modal from closing when clicking inside the modal
    modal.addEventListener('click', event => event.stopPropagation());
    errorModal.addEventListener('click', event => event.stopPropagation());

    // Close all dropdowns if clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    });

    // Load saved notes on page load
    loadSavedNotes();
});
