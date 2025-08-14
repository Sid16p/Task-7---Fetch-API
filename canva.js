        const API_URL = 'https://jsonplaceholder.typicode.com/users';
        
        // DOM elements
        const reloadBtn = document.getElementById('reloadBtn');
        const reloadText = document.getElementById('reloadText');
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const errorMessage = document.getElementById('errorMessage');
        const usersContainer = document.getElementById('usersContainer');
        const statsContainer = document.getElementById('statsContainer');
        const userCount = document.getElementById('userCount');
        
        // State management
        let isLoading = false;
        
        // Fetch users from API
        async function fetchUsers() {
            if (isLoading) return;
            
            try {
                setLoadingState(true);
                hideError();
                clearUsers();
                
                const response = await fetch(API_URL);
                
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                }
                
                const users = await response.json();
                
                if (!Array.isArray(users) || users.length === 0) {
                    throw new Error('No user data received from API');
                }
                
                displayUsers(users);
                updateStats(users.length);
                
            } catch (error) {
                console.error('Error fetching users:', error);
                showError(error.message);
            } finally {
                setLoadingState(false);
            }
        }
        
        // Display users in the UI
        function displayUsers(users) {
            usersContainer.innerHTML = '';
            
            users.forEach((user, index) => {
                const userCard = createUserCard(user);
                usersContainer.appendChild(userCard);
                
                // Add staggered animation
                setTimeout(() => {
                    userCard.classList.remove('opacity-0');
                    userCard.classList.add('fade-in');
                }, index * 100);
            });
        }
        
        // Create individual user card
        function createUserCard(user) {
            const card = document.createElement('div');
            card.className = 'user-card bg-white rounded-lg shadow-md p-6 opacity-0';
            
            card.innerHTML = `
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        ${user.name.charAt(0)}
                    </div>
                    <div class="ml-4">
                        <h3 class="text-xl font-semibold text-gray-800">${escapeHtml(user.name)}</h3>
                        <p class="text-gray-500 text-sm">@${escapeHtml(user.username)}</p>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="flex items-center text-gray-600">
                        <span class="text-blue-500 mr-2">📧</span>
                        <span class="text-sm">${escapeHtml(user.email)}</span>
                    </div>
                    
                    <div class="flex items-start text-gray-600">
                        <span class="text-green-500 mr-2 mt-0.5">📍</span>
                        <div class="text-sm">
                            <div>${escapeHtml(user.address.street)} ${escapeHtml(user.address.suite)}</div>
                            <div>${escapeHtml(user.address.city)}, ${escapeHtml(user.address.zipcode)}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center text-gray-600">
                        <span class="text-purple-500 mr-2">📞</span>
                        <span class="text-sm">${escapeHtml(user.phone)}</span>
                    </div>
                    
                    <div class="flex items-center text-gray-600">
                        <span class="text-orange-500 mr-2">🌐</span>
                        <span class="text-sm">${escapeHtml(user.website)}</span>
                    </div>
                    
                    <div class="pt-2 border-t border-gray-100">
                        <div class="text-xs text-gray-500">
                            <strong>Company:</strong> ${escapeHtml(user.company.name)}
                        </div>
                    </div>
                </div>
            `;
            
            return card;
        }
        
        // Utility functions
        function setLoadingState(loading) {
            isLoading = loading;
            loadingState.classList.toggle('hidden', !loading);
            reloadBtn.disabled = loading;
            
            if (loading) {
                reloadText.textContent = '⏳ Loading...';
                reloadBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                reloadText.textContent = '🔄 Reload Data';
                reloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
        
        function showError(message) {
            errorMessage.textContent = message;
            errorState.classList.remove('hidden');
            statsContainer.classList.add('hidden');
        }
        
        function hideError() {
            errorState.classList.add('hidden');
        }
        
        function clearUsers() {
            usersContainer.innerHTML = '';
            statsContainer.classList.add('hidden');
        }
        
        function updateStats(count) {
            userCount.textContent = count;
            statsContainer.classList.remove('hidden');
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Event listeners
        reloadBtn.addEventListener('click', fetchUsers);
        
        // Initial load
        fetchUsers();
