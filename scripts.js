document.addEventListener('DOMContentLoaded', function() {
    // Function to expand the navbar
    function expandNavbar() {
        const topBox = document.getElementById('top-box');
        const bottomBox = document.getElementById('bottom-box');
        const navbarBox = document.getElementById('navbar-box');

        navbarBox.classList.toggle('expanded');

        if (navbarBox.classList.contains('expanded')) {
            topBox.style.width = '392px';
            bottomBox.style.width = '392px';
            bottomBox.style.display = 'block';
        } else {
            topBox.style.width = '132px';
            bottomBox.style.width = '132px';
            bottomBox.style.display = 'none';
        }
    }

    // Attach onclick event to arrow container box
    const arrowContainer = document.querySelector('.arrow-container');
    arrowContainer.addEventListener('click', expandNavbar);

    // Function to populate asset titles and descriptions into additional-info divs
    async function populateAssetInfo() {
        try {
            const response = await fetch('Data.json');
            const data = await response.json();
            const task = data.tasks.find(task => task.task_id === 18882);
            if (task) {
                document.querySelector('.task-title').textContent = task.task_title;
                document.querySelector('.task-description').textContent = task.task_description;

                const cards = document.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    const asset = task.assets[index];
                    if (asset) {
                        const assetTitle = asset.asset_title;
                        const assetDescription = asset.asset_description;

                        const descriptionText = card.querySelector(`.description-text${index + 1}`);
                        if (descriptionText) {
                            descriptionText.textContent = assetDescription;
                        }

                        const additionalInfo = card.querySelector('.additional-info');
                        if (additionalInfo) {
                            additionalInfo.textContent = assetTitle;
                        }
                    }
                });

                populateCardTitles(task);
            }
        } catch (error) {
            console.error('Error loading JSON data:', error);
        }
    }

    function populateCardTitles(task) {
        const bottomBox = document.getElementById('bottom-box');
        bottomBox.innerHTML = ''; // Clear previous content

        const titleElement = document.createElement('li');
        titleElement.innerHTML = `<strong>${task.task_title}</strong>`;
        bottomBox.appendChild(titleElement);

        const ul = document.createElement('ul');
        task.assets.forEach(asset => {
            const li = document.createElement('li');
            li.textContent = asset.asset_title;
            ul.appendChild(li);
        });
        bottomBox.appendChild(ul);

        // Initially hide the bottom box content
        bottomBox.style.display = 'none';
    }

    // Function to play video on image click
    function playVideoOnClick(videoUrl) {
        const cardImg = document.querySelector('.card1-img');
        cardImg.addEventListener('click', function() {
            const videoIframe = document.createElement('iframe');
            videoIframe.src = videoUrl;
            videoIframe.width = '560';
            videoIframe.height = '315';
            videoIframe.frameBorder = '0';
            videoIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            videoIframe.allowFullscreen = true;

            const cardContent = cardImg.parentNode;
            cardContent.innerHTML = ''; // Clear existing content
            cardContent.appendChild(videoIframe);
        });
    }

    // Call the function to populate asset titles and descriptions
    populateAssetInfo();

    // Fetch the JSON data and add event listener for the video play
    fetch('Data.json')
        .then(response => response.json())
        .then(data => {
            const task = data.tasks.find(task => task.task_id === 18882);
            if (task) {
                const videoAsset = task.assets.find(asset => asset.asset_content_type === 'video');
                if (videoAsset) {
                    playVideoOnClick(videoAsset.asset_content.trim());
                }
            }
            
        })
        .catch(error => console.error('Error fetching JSON data:', error));
});
