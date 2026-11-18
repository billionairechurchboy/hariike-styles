// Collection Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const collectionItems = document.querySelectorAll('.collection-item');
    
    // Function to filter collection items based on active filters
    function filterCollections() {
        // Get all active filter values (excluding 'all')
        const activeFilters = Array.from(filterButtons)
            .filter(btn => btn.classList.contains('active') && btn.getAttribute('data-filter') !== 'all')
            .map(btn => btn.getAttribute('data-filter'));
        
        // Get the 'All' button
        const allButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
        const isAllActive = allButton && allButton.classList.contains('active');
        
        // Filter collection items
        collectionItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (isAllActive || activeFilters.length === 0) {
                // Show all items if "All" is active or no filters are selected
                item.style.display = 'block';
            } else {
                // Show item if its category matches any of the active filters
                if (activeFilters.includes(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }
    
    // Initialize display on page load - show all items by default
    // First, explicitly show all items on load (important for mobile)
    collectionItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        // On mobile, ensure visibility immediately
        if (window.innerWidth <= 768) {
            item.style.opacity = '1';
            item.style.transform = 'none';
            item.classList.add('revealed');
        }
    });
    
    // Then run the filter function
    filterCollections();
    
    // On mobile, ensure scroll-reveal items are immediately visible
    if (window.innerWidth <= 768) {
        const scrollRevealItems = document.querySelectorAll('.collection-section .scroll-reveal');
        scrollRevealItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'none';
            item.classList.add('revealed');
        });
    }
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            if (filterValue === 'all') {
                // If "All" is clicked, clear all other selections and activate "All"
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            } else {
                // Get the "All" button and deactivate it if this filter is being activated
                const allButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
                const wasActive = button.classList.contains('active');
                
                // Toggle the clicked button's active state
                button.classList.toggle('active');
                
                // If this filter is now active, deactivate "All"
                if (allButton && button.classList.contains('active')) {
                    allButton.classList.remove('active');
                }
            }
            
            // Apply filters
            filterCollections();
        });
    });
    
    // Handle view details button clicks
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the collection item
            const collectionItem = button.closest('.collection-item');
            const category = collectionItem.getAttribute('data-category');
            
            // Collection data
            const collectionData = {
                'summer-rain': { name: 'SUMMER RAIN DRESS', price: '265k' },
                'nova-001': { name: 'NOVA 001', price: '218k' },
                'nova-002': { name: 'NOVA 002', price: '211k' },
                'tiara': { name: 'TIARA DRESS', price: '120k' },
                'ripple': { name: 'THE RIPPLE DRESS', price: '250k' },
                'bloom': { name: 'BLOOM DRESS', price: '186k' },
                'velora': { name: 'VELORA DRESS', price: '375k' },
                'coral-cascade': { name: 'CORAL CASCADE', price: 'TBD' },
                'noir': { name: 'NOIR', price: 'TBD' },
                'olive-opulence': { name: 'OLIVE OPULENCE', price: 'TBD' },
                'emerald-bloom': { name: 'EMERALD BLOOM', price: 'TBD' },
                'ethereal': { name: 'ETHEREAL', price: 'TBD' }
            };
            
            const collectionInfo = collectionData[category];
            
            if (collectionInfo) {
                // Use the showCollectionModal function from script.js
                showCollectionModal(collectionInfo.name, collectionInfo.price);
            }
        });
    });
});

