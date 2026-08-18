document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-bar input");
    const productGrid = document.getElementById("homeproducts-container");
    const productCards = Array.from(
      productGrid.getElementsByClassName("product-card")
    );

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();

      productCards.forEach((card) => {
        const productName = card
          .querySelector(".product-name")
          .textContent.toLowerCase();
        const productCompany = card
          .querySelector(".product-company")
          .textContent.toLowerCase();

        if (
          productName.includes(searchTerm) ||
          productCompany.includes(searchTerm)
        ) {
          card.style.display = "block"; // Show matching product
        } else {
          card.style.display = "none"; // Hide non-matching product
        }
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Chat elements
    const chatIcon = document.getElementById('open-chat');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatArea = document.getElementById('chat-area');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    
    // FAQ answers
    const faqResponses = {
      "How to sell on NATIVEGOODS?": 
        "To start selling on NativGoods:<br>1. Sign up or log in to your account<br>2. Go to the SellProduct section<br>3. Add product details, including name, description, price,category and images<br>4. Submit your product for listing<br>5. Once added, your product will be visible for all users to browse and purchase!",
      
      "what are the seller fees?": 
        "There are no seller fees on NativGoods.<br>Our platform is completely free to use, allowing you to sell your products without any charges or commissions!",
      
      "How to report issues?": 
        "Send an email to nativegoodsonline@gmail with the issue details.<br>Our team will review and address it as soon as possible!",
      
      "How to filter products?": 
        "You can filter products by name, company, price, and category.<br>Simply use the available filter options to find what you need!",
        "Hi?":
        "Hi, welcome to Nativegoods chatbot.<br>How can i help you!",
       
        "owner?":
        "I am Nativegoods, <br>created by Albin Rajesh, Aswinkesh A, Emil Baiju, Gino James & Jacob Sam",
        "buy?":
        "You can buy product by clicking on buy now or<br>by adding products to cart and navigate to checkout.",
        "payment?":
        "Secure payment is under construction, launching soon!!!",
        "edit?":
        "You can edit your user details and<br>delete added products from the profile page."
      
        };
    
    // Open chat window
    chatIcon.addEventListener('click', function() {
      chatWindow.style.display = 'flex';
    });
    
    // Close chat window
    closeChat.addEventListener('click', function() {
      chatWindow.style.display = 'none';
    });
    
    // Add FAQ option click handlers
    document.querySelectorAll('.faq-option').forEach(option => {
      option.addEventListener('click', function() {
        const question = this.textContent;
        addUserMessage(question);
        
        // Show typing indicator
        showTypingIndicator();
        
        // Delay response to simulate typing
        setTimeout(() => {
          removeTypingIndicator();
          addBotMessage(faqResponses[question]);
        }, 1000);
      });
    });
    
    // Send button click handler
    sendButton.addEventListener('click', sendMessage);
    
    // Enter key press handler
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Function to send user message
    function sendMessage() {
      const message = userInput.value.trim();
      if (message) {
        addUserMessage(message);
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process response with some delay to simulate typing
        setTimeout(() => {
          removeTypingIndicator();
          processUserMessage(message);
        }, 1000);
      }
    }
    
    // Add user message to chat
    function addUserMessage(message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message user-message fade-in';
      messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
      chatArea.appendChild(messageDiv);
      scrollToBottom();
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message bot-message fade-in';
      messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
      chatArea.appendChild(messageDiv);
      scrollToBottom();
    }
    
    // Show typing indicator
    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-message bot-message fade-in';
      typingDiv.id = 'typing-indicator';
      typingDiv.innerHTML = `
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      chatArea.appendChild(typingDiv);
      scrollToBottom();
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }
    
    // Process user message and generate response
    function processUserMessage(message) {
      // Convert message to lowercase for easier matching
      const lowerMessage = message.toLowerCase();
      
      // Check for keywords and provide appropriate responses
      if (lowerMessage.includes('sell') || lowerMessage.includes('selling')) {
        addBotMessage(faqResponses["How to sell on NATIVEGOODS?"]);
      } 
      else if (lowerMessage.includes('seller') || lowerMessage.includes('fees') || lowerMessage.includes('fee')) {
        addBotMessage(faqResponses["what are the seller fees?"]);
      }
      else if (lowerMessage.includes('report') || lowerMessage.includes('issues') || lowerMessage.includes('issue')) {
        addBotMessage(faqResponses["How to report issues?"]);
      }
      else if (lowerMessage.includes('filter') || lowerMessage.includes('category') || lowerMessage.includes('products')) {
        addBotMessage(faqResponses["How to filter products?"]);
      }
      else if (lowerMessage.includes('hi') || lowerMessage.includes('how') ) {
        addBotMessage(faqResponses["Hi?"]);
      }
     
      else if (lowerMessage.includes('created') || lowerMessage.includes('team')) {
        addBotMessage(faqResponses["owner?"]);
      }
      else if (lowerMessage.includes('buy')  ) {
        addBotMessage(faqResponses["buy?"]);
      }
      else if (lowerMessage.includes('payment') ) {
        addBotMessage(faqResponses["payment?"]);
      }
      else if (lowerMessage.includes('edit') || lowerMessage.includes('delete')) {
        addBotMessage(faqResponses["edit?"]);
      }
     
      else {
        // Default response for unrecognized queries
        addBotMessage("I'm not sure I understand your question. Please choose from one of these common topics or contact us directly at nativegoodsonline@gmail.com for personalized assistance.");
        
        // Show FAQ options again
        const faqOptions = document.createElement('div');
        faqOptions.className = 'faq-options fade-in';
        faqOptions.innerHTML = `
          <div class="faq-option">How to sell on NATIVEGOODS?</div>
        <div class="faq-option">what are the seller fees?</div>
        <div class="faq-option">How to report issues?</div>
        <div class="faq-option">How to filter products?</div>
        `;
        chatArea.appendChild(faqOptions);
        
        // Add click handlers to new options
        faqOptions.querySelectorAll('.faq-option').forEach(option => {
          option.addEventListener('click', function() {
            const question = this.textContent;
            addUserMessage(question);
            
            // Show typing indicator
            showTypingIndicator();
            
            // Delay response to simulate typing
            setTimeout(() => {
              removeTypingIndicator();
              addBotMessage(faqResponses[question]);
            }, 1000);
          });
        });
      }
      
      scrollToBottom();
    }
    
    // Scroll chat to bottom
    function scrollToBottom() {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  });

//user location capturing code
document.getElementById("location-btn").addEventListener("click", function () {
    let locationText = document.getElementById("location-text");
    locationText.innerText = "Fetching location...";

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then(data => {
                        let addressParts = data.display_name.split(", ");
                        let addressLength = addressParts.length;

                        if (addressLength >= 4) {
                            let formattedAddress = `${addressParts[addressLength - 4]}, ${addressParts[addressLength - 3]}`;
                            locationText.innerText = formattedAddress;
                        } else {
                            locationText.innerText = data.display_name; 
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching address:", error);
                        locationText.innerText = "Error fetching location";
                    });
            },
            function (error) {
                locationText.innerText = "Connection error";
                console.error("Error:", error);
            }
        );
    } 
    else {
        locationText.innerText = "Geolocation not supported";
    }
    })  
    //location code end


    