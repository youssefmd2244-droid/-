// app.js
document.addEventListener('DOMContentLoaded', function() {
    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDummyAPIKeyForDemoPurposesOnly",
        authDomain: "saudi-store-demo.firebaseapp.com",
        projectId: "saudi-store-demo",
        storageBucket: "saudi-store-demo.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:dummyappidforfirebasedemo"
    };

    // Initialize Firebase
    let firebaseInitialized = false;
    try {
        firebase.initializeApp(firebaseConfig);
        firebaseInitialized = true;
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.log("Firebase initialization failed, using localStorage fallback:", error);
        firebaseInitialized = false;
    }

    // Database references
    let db;
    let productsRef, commentsRef, updatesRef, settingsRef, sectionsRef;
    
    if (firebaseInitialized) {
        db = firebase.firestore();
        productsRef = db.collection('products');
        commentsRef = db.collection('comments');
        updatesRef = db.collection('updates');
        settingsRef = db.collection('settings');
        sectionsRef = db.collection('sections');
    }

    // State Management
    const state = {
        theme: localStorage.getItem('theme') || 'light',
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        storeName: localStorage.getItem('storeName') || 'متجر نقاشة سعودي',
        currency: localStorage.getItem('currency') || 'SAR',
        language: localStorage.getItem('language') || 'ar',
        primaryColor: localStorage.getItem('primaryColor') || '#3a86ff',
        whatsappNumber: localStorage.getItem('whatsappNumber') || '966500000000',
        instagramAccount: localStorage.getItem('instagramAccount') || 'nashasha_store',
        sections: JSON.parse(localStorage.getItem('sections')) || [
            { id: 'home', name: 'الرئيسية', visible: true, order: 0 },
            { id: 'products', name: 'المنتجات', visible: true, order: 1 },
            { id: 'videos', name: 'فيديوهات المنتجات', visible: true, order: 2 },
            { id: 'comments', name: 'التعليقات', visible: true, order: 3 },
            { id: 'updates', name: 'التحديثات', visible: true, order: 4 },
            { id: 'contact', name: 'الدعم', visible: true, order: 5 },
            { id: 'programmer', name: 'المطور', visible: true, order: 6 }
        ],
        products: JSON.parse(localStorage.getItem('products')) || [
            {
                id: '1',
                name: 'ساعة ذكية',
                price: 299,
                description: 'ساعة ذكية بتقنيات متقدمة',
                mediaType: 'image',
                mediaUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
                category: 'إلكترونيات',
                order: 0
            },
            {
                id: '2',
                name: 'عطر فاخر',
                price: 450,
                description: 'عطر فاخر برائحة عربية أصيلة',
                mediaType: 'image',
                mediaUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w-400&h=300&fit=crop',
                category: 'عطور',
                order: 1
            },
            {
                id: '3',
                name: 'مجوهرات ذهبية',
                price: 1200,
                description: 'مجوهرات ذهبية عيار 21',
                mediaType: 'image',
                mediaUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop',
                category: 'مجوهرات',
                order: 2
            }
        ],
        comments: JSON.parse(localStorage.getItem('comments')) || [
            {
                id: '1',
                author: 'أحمد',
                content: 'منتجات رائعة وجودة عالية، شكرًا لكم!',
                date: '2023-10-15',
                pinned: true
            },
            {
                id: '2',
                author: 'سارة',
                content: 'تجربة شراء ممتازة، والتوصيل سريع',
                date: '2023-10-10',
                pinned: false
            }
        ],
        updates: JSON.parse(localStorage.getItem('updates')) || [
            {
                id: '1',
                content: 'تم إضافة منتجات جديدة إلى المتجر',
                date: '2023-10-20'
            },
            {
                id: '2',
                content: 'خصم 20% على جميع المنتجات هذا الأسبوع',
                date: '2023-10-18'
            }
        ],
        categories: JSON.parse(localStorage.getItem('categories')) || ['عام', 'إلكترونيات', 'عطور', 'مجوهرات', 'ملابس']
    };

    // DOM Elements
    const elements = {
        // Theme
        body: document.body,
        themeToggle: document.getElementById('themeToggle'),
        
        // Admin
        adminAccessBtn: document.getElementById('adminAccessBtn'),
        adminAccessModal: document.getElementById('adminAccessModal'),
        adminCodeInput: document.getElementById('adminCodeInput'),
        submitAdminCode: document.getElementById('submitAdminCode'),
        cancelAdminCode: document.getElementById('cancelAdminCode'),
        adminPanel: document.getElementById('adminPanel'),
        closeAdminPanel: document.getElementById('closeAdminPanel'),
        
        // Store
        storeName: document.getElementById('storeName'),
        storeLogo: document.getElementById('storeLogo'),
        dynamicStoreName: document.getElementById('dynamicStoreName'),
        storeGrid: document.getElementById('storeGrid'),
        
        // Mobile
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileNav: document.getElementById('mobileNav'),
        
        // Products
        productsGrid: document.getElementById('productsGrid'),
        sortableProducts: document.getElementById('sortableProducts'),
        addProductBtn: document.getElementById('addProductBtn'),
        
        // Product Modal
        productModal: document.getElementById('productModal'),
        productModalTitle: document.getElementById('productModalTitle'),
        productName: document.getElementById('productName'),
        productPrice: document.getElementById('productPrice'),
        productDescription: document.getElementById('productDescription'),
        productMediaType: document.getElementById('productMediaType'),
        productMediaUrl: document.getElementById('productMediaUrl'),
        productCategory: document.getElementById('productCategory'),
        saveProductBtn: document.getElementById('saveProductBtn'),
        cancelProductBtn: document.getElementById('cancelProductBtn'),
        editingProductId: document.getElementById('editingProductId'),
        
        // Sections
        sectionsList: document.getElementById('sectionsList'),
        newSectionName: document.getElementById('newSectionName'),
        addSectionBtn: document.getElementById('addSectionBtn'),
        aiGenerateSectionBtn: document.getElementById('aiGenerateSectionBtn'),
        
        // Comments
        commentsList: document.getElementById('commentsList'),
        adminCommentsList: document.getElementById('adminCommentsList'),
        newCommentText: document.getElementById('newCommentText'),
        submitCommentBtn: document.getElementById('submitCommentBtn'),
        pinnedComments: document.getElementById('pinnedComments'),
        
        // Updates
        updatesList: document.getElementById('updatesList'),
        adminUpdatesList: document.getElementById('adminUpdatesList'),
        newUpdateText: document.getElementById('newUpdateText'),
        addUpdateBtn: document.getElementById('addUpdateBtn'),
        
        // Videos
        videosGrid: document.getElementById('videosGrid'),
        
        // Settings
        storeNameInput: document.getElementById('storeNameInput'),
        storeCurrency: document.getElementById('storeCurrency'),
        storeLanguage: document.getElementById('storeLanguage'),
        primaryColor: document.getElementById('primaryColor'),
        whatsappNumber: document.getElementById('whatsappNumber'),
        instagramAccount: document.getElementById('instagramAccount'),
        factoryResetBtn: document.getElementById('factoryResetBtn'),
        clearDataBtn: document.getElementById('clearDataBtn'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        
        // Tabs
        adminTabs: document.querySelectorAll('.admin-tab'),
        adminTabContents: document.querySelectorAll('.admin-tab-content'),
        
        // Loading
        loadingOverlay: document.getElementById('loadingOverlay')
    };

    // Initialize the application
    function init() {
        applyTheme();
        loadStoreData();
        renderProducts();
        renderVideos();
        renderComments();
        renderUpdates();
        renderSections();
        renderPinnedComments();
        setupEventListeners();
        checkAdminStatus();
        
        // Load data from Firebase if available
        if (firebaseInitialized) {
            loadFirebaseData();
        }
        
        // Hide loading overlay
        setTimeout(() => {
            elements.loadingOverlay.style.display = 'none';
        }, 1000);
    }

    // Apply current theme
    function applyTheme() {
        elements.body.setAttribute('data-theme', state.theme);
        elements.themeToggle.innerHTML = state.theme === 'light' ? 
            '<i class="fas fa-moon"></i>' : 
            '<i class="fas fa-sun"></i>';
        
        // Apply primary color
        document.documentElement.style.setProperty('--primary-color', state.primaryColor);
    }

    // Load store data from state
    function loadStoreData() {
        elements.storeName.textContent = state.storeName;
        elements.dynamicStoreName.textContent = state.storeName;
        elements.storeNameInput.value = state.storeName;
        elements.storeCurrency.value = state.currency;
        elements.storeLanguage.value = state.language;
        elements.primaryColor.value = state.primaryColor;
        elements.whatsappNumber.value = state.whatsappNumber;
        elements.instagramAccount.value = state.instagramAccount;
    }

    // Load data from Firebase
    async function loadFirebaseData() {
        try {
            // Load products
            const productsSnapshot = await productsRef.orderBy('order').get();
            if (!productsSnapshot.empty) {
                state.products = [];
                productsSnapshot.forEach(doc => {
                    state.products.push({ id: doc.id, ...doc.data() });
                });
                renderProducts();
                renderAdminProducts();
            }
            
            // Load comments
            const commentsSnapshot = await commentsRef.orderBy('date', 'desc').get();
            if (!commentsSnapshot.empty) {
                state.comments = [];
                commentsSnapshot.forEach(doc => {
                    state.comments.push({ id: doc.id, ...doc.data() });
                });
                renderComments();
                renderAdminComments();
                renderPinnedComments();
            }
            
            // Load updates
            const updatesSnapshot = await updatesRef.orderBy('date', 'desc').get();
            if (!updatesSnapshot.empty) {
                state.updates = [];
                updatesSnapshot.forEach(doc => {
                    state.updates.push({ id: doc.id, ...doc.data() });
                });
                renderUpdates();
                renderAdminUpdates();
            }
            
            // Load settings
            const settingsSnapshot = await settingsRef.doc('store').get();
            if (settingsSnapshot.exists) {
                const settings = settingsSnapshot.data();
                state.storeName = settings.storeName || state.storeName;
                state.currency = settings.currency || state.currency;
                state.language = settings.language || state.language;
                state.primaryColor = settings.primaryColor || state.primaryColor;
                state.whatsappNumber = settings.whatsappNumber || state.whatsappNumber;
                state.instagramAccount = settings.instagramAccount || state.instagramAccount;
                
                loadStoreData();
                applyTheme();
            }
            
            // Load sections
            const sectionsSnapshot = await sectionsRef.orderBy('order').get();
            if (!sectionsSnapshot.empty) {
                state.sections = [];
                sectionsSnapshot.forEach(doc => {
                    state.sections.push({ id: doc.id, ...doc.data() });
                });
                renderSections();
            }
            
        } catch (error) {
            console.error("Error loading data from Firebase:", error);
        }
    }

    // Save data to Firebase
    async function saveToFirebase(collection, data, id = null) {
        if (!firebaseInitialized) return false;
        
        try {
            if (id) {
                await db.collection(collection).doc(id).set(data, { merge: true });
            } else {
                await db.collection(collection).add(data);
            }
            return true;
        } catch (error) {
            console.error("Error saving to Firebase:", error);
            return false;
        }
    }

    // Delete data from Firebase
    async function deleteFromFirebase(collection, id) {
        if (!firebaseInitialized) return false;
        
        try {
            await db.collection(collection).doc(id).delete();
            return true;
        } catch (error) {
            console.error("Error deleting from Firebase:", error);
            return false;
        }
    }

    // Render products in the store
    function renderProducts() {
        elements.productsGrid.innerHTML = '';
        
        // Sort products by order
        const sortedProducts = [...state.products].sort((a, b) => a.order - b.order);
        
        sortedProducts.forEach(product => {
            if (!product.visible) return;
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            
            let mediaHTML = '';
            if (product.mediaType === 'image') {
                mediaHTML = `<img src="${product.mediaUrl}" alt="${product.name}" loading="lazy">`;
            } else if (product.mediaType === 'video') {
                mediaHTML = `<video controls preload="metadata"><source src="${product.mediaUrl}" type="video/mp4">متصفحك لا يدعم تشغيل الفيديو</video>`;
            } else if (product.mediaType === 'gif') {
                mediaHTML = `<img src="${product.mediaUrl}" alt="${product.name}" loading="lazy">`;
            }
            
            productCard.innerHTML = `
                <div class="product-media">
                    ${mediaHTML}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price} ${state.currency}</div>
                    <div class="product-actions">
                        <button class="btn-primary product-action-btn whatsapp-btn order-whatsapp" data-product='${JSON.stringify(product).replace(/'/g, "\\'")}'>
                            <i class="fab fa-whatsapp"></i> طلب عبر واتساب
                        </button>
                        <button class="btn-secondary product-action-btn instagram-btn order-instagram" data-product='${JSON.stringify(product).replace(/'/g, "\\'")}'>
                            <i class="fab fa-instagram"></i> طلب عبر إنستغرام
                        </button>
                    </div>
                </div>
            `;
            
            elements.productsGrid.appendChild(productCard);
        });
        
        // Add event listeners to order buttons
        document.querySelectorAll('.order-whatsapp').forEach(btn => {
            btn.addEventListener('click', handleWhatsAppOrder);
        });
        
        document.querySelectorAll('.order-instagram').forEach(btn => {
            btn.addEventListener('click', handleInstagramOrder);
        });
        
        // Also render in admin panel
        renderAdminProducts();
    }

    // Render products in admin panel
    function renderAdminProducts() {
        elements.sortableProducts.innerHTML = '';
        
        // Sort products by order
        const sortedProducts = [...state.products].sort((a, b) => a.order - b.order);
        
        sortedProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'sortable-product';
            productItem.dataset.id = product.id;
            productItem.draggable = true;
            
            productItem.innerHTML = `
                <div class="product-details">
                    <h4>${product.name}</h4>
                    <p>${product.price} ${state.currency} - ${product.category}</p>
                </div>
                <div class="product-controls">
                    <button class="icon-btn edit-product" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-product" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            elements.sortableProducts.appendChild(productItem);
        });
        
        // Add event listeners to admin product controls
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', () => editProduct(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
        });
        
        // Make products sortable
        makeSortable();
    }

    // Render videos
    function renderVideos() {
        elements.videosGrid.innerHTML = '';
        
        // Filter products that have videos
        const videoProducts = state.products.filter(product => product.mediaType === 'video');
        
        videoProducts.forEach(product => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            
            videoItem.innerHTML = `
                <video controls preload="metadata">
                    <source src="${product.mediaUrl}" type="video/mp4">
                    متصفحك لا يدعم تشغيل الفيديو
                </video>
                <div class="video-info">
                    <h4>${product.name}</h4>
                    <p>${product.price} ${state.currency}</p>
                </div>
            `;
            
            elements.videosGrid.appendChild(videoItem);
        });
    }

    // Render comments
    function renderComments() {
        elements.commentsList.innerHTML = '';
        
        // Sort comments by date (newest first)
        const sortedComments = [...state.comments].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = `comment-item ${comment.pinned ? 'pinned-comment' : ''}`;
            commentItem.dataset.id = comment.id;
            
            commentItem.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
                ${state.isAdmin ? `
                <div class="comment-actions">
                    <button class="icon-btn delete-comment" data-id="${comment.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="icon-btn ${comment.pinned ? 'unpin-comment' : 'pin-comment'}" data-id="${comment.id}">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                </div>
                ` : ''}
            `;
            
            elements.commentsList.appendChild(commentItem);
        });
        
        // Add event listeners to comment actions (if admin)
        if (state.isAdmin) {
            document.querySelectorAll('.delete-comment').forEach(btn => {
                btn.addEventListener('click', () => deleteComment(btn.dataset.id));
            });
            
            document.querySelectorAll('.pin-comment, .unpin-comment').forEach(btn => {
                btn.addEventListener('click', () => togglePinComment(btn.dataset.id));
            });
        }
    }

    // Render comments in admin panel
    function renderAdminComments() {
        elements.adminCommentsList.innerHTML = '';
        
        // Sort comments by date (newest first)
        const sortedComments = [...state.comments].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = `comment-item ${comment.pinned ? 'pinned-comment' : ''}`;
            commentItem.dataset.id = comment.id;
            
            commentItem.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-actions">
                    <button class="icon-btn delete-comment" data-id="${comment.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="icon-btn ${comment.pinned ? 'unpin-comment' : 'pin-comment'}" data-id="${comment.id}">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                </div>
            `;
            
            elements.adminCommentsList.appendChild(commentItem);
        });
        
        // Add event listeners
        document.querySelectorAll('.delete-comment').forEach(btn => {
            btn.addEventListener('click', () => deleteComment(btn.dataset.id));
        });
        
        document.querySelectorAll('.pin-comment, .unpin-comment').forEach(btn => {
            btn.addEventListener('click', () => togglePinComment(btn.dataset.id));
        });
    }

    // Render pinned comments on homepage
    function renderPinnedComments() {
        elements.pinnedComments.innerHTML = '<h4>آراء العملاء المميزة</h4>';
        
        const pinnedComments = state.comments.filter(comment => comment.pinned);
        
        if (pinnedComments.length === 0) {
            elements.pinnedComments.innerHTML += '<p>لا توجد تعليقات مثبتة بعد</p>';
            return;
        }
        
        pinnedComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item pinned-comment';
            
            commentItem.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            `;
            
            elements.pinnedComments.appendChild(commentItem);
        });
    }

    // Render updates
    function renderUpdates() {
        elements.updatesList.innerHTML = '';
        
        // Sort updates by date (newest first)
        const sortedUpdates = [...state.updates].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedUpdates.forEach(update => {
            const updateItem = document.createElement('div');
            updateItem.className = 'update-item';
            updateItem.dataset.id = update.id;
            
            updateItem.innerHTML = `
                <div class="update-content">${update.content}</div>
                <div class="update-date">${formatDate(update.date)}</div>
                ${state.isAdmin ? `
                <div class="update-actions">
                    <button class="icon-btn delete-update" data-id="${update.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                ` : ''}
            `;
            
            elements.updatesList.appendChild(updateItem);
        });
        
        // Add event listeners to update actions (if admin)
        if (state.isAdmin) {
            document.querySelectorAll('.delete-update').forEach(btn => {
                btn.addEventListener('click', () => deleteUpdate(btn.dataset.id));
            });
        }
    }

    // Render updates in admin panel
    function renderAdminUpdates() {
        elements.adminUpdatesList.innerHTML = '';
        
        // Sort updates by date (newest first)
        const sortedUpdates = [...state.updates].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedUpdates.forEach(update => {
            const updateItem = document.createElement('div');
            updateItem.className = 'update-item';
            updateItem.dataset.id = update.id;
            
            updateItem.innerHTML = `
                <div class="update-content">${update.content}</div>
                <div class="update-date">${formatDate(update.date)}</div>
                <div class="update-actions">
                    <button class="icon-btn delete-update" data-id="${update.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            elements.adminUpdatesList.appendChild(updateItem);
        });
        
        // Add event listeners
        document.querySelectorAll('.delete-update').forEach(btn => {
            btn.addEventListener('click', () => deleteUpdate(btn.dataset.id));
        });
    }

    // Render sections in admin panel
    function renderSections() {
        elements.sectionsList.innerHTML = '';
        
        // Sort sections by order
        const sortedSections = [...state.sections].sort((a, b) => a.order - b.order);
        
        sortedSections.forEach(section => {
            const sectionItem = document.createElement('div');
            sectionItem.className = 'section-item';
            sectionItem.dataset.id = section.id;
            
            sectionItem.innerHTML = `
                <div class="section-info">
                    <h4>${section.name}</h4>
                    <span class="section-id">(${section.id})</span>
                </div>
                <div class="section-controls">
                    <button class="icon-btn toggle-section" data-id="${section.id}">
                        <i class="fas fa-eye${section.visible ? '' : '-slash'}"></i>
                    </button>
                    <button class="icon-btn delete-section" data-id="${section.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            elements.sectionsList.appendChild(sectionItem);
        });
        
        // Update section toggles in the store
        updateSectionToggles();
        
        // Add event listeners
        document.querySelectorAll('.toggle-section').forEach(btn => {
            btn.addEventListener('click', () => toggleSectionVisibility(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-section').forEach(btn => {
            btn.addEventListener('click', () => deleteSection(btn.dataset.id));
        });
        
        // Populate categories in product modal
        populateCategories();
    }

    // Update section toggles in the store
    function updateSectionToggles() {
        state.sections.forEach(section => {
            const sectionElement = document.getElementById(`${section.id}Section`);
            const toggleBtn = document.querySelector(`.section-toggle[data-section="${section.id}"]`);
            
            if (sectionElement && toggleBtn) {
                if (section.visible) {
                    sectionElement.style.display = 'flex';
                    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
                } else {
                    sectionElement.style.display = 'none';
                    toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                }
            }
        });
    }

    // Populate categories in product modal
    function populateCategories() {
        elements.productCategory.innerHTML = '';
        
        state.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            elements.productCategory.appendChild(option);
        });
        
        // Add option to add new category
        const addNewOption = document.createElement('option');
        addNewOption.value = 'add_new';
        addNewOption.textContent = '+ إضافة قسم جديد';
        elements.productCategory.appendChild(addNewOption);
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Make products sortable in admin panel
    function makeSortable() {
        const sortableContainer = elements.sortableProducts;
        let draggedItem = null;
        
        sortableContainer.querySelectorAll('.sortable-product').forEach(item => {
            item.addEventListener('dragstart', function() {
                draggedItem = this;
                setTimeout(() => {
                    this.style.opacity = '0.5';
                }, 0);
            });
            
            item.addEventListener('dragend', function() {
                setTimeout(() => {
                    this.style.opacity = '1';
                    draggedItem = null;
                }, 0);
                
                // Update product order
                updateProductOrder();
            });
            
            item.addEventListener('dragover', function(e) {
                e.preventDefault();
            });
            
            item.addEventListener('dragenter', function(e) {
                e.preventDefault();
                if (this !== draggedItem) {
                    this.style.borderTop = '2px solid var(--primary-color)';
                }
            });
            
            item.addEventListener('dragleave', function() {
                this.style.borderTop = '';
            });
            
            item.addEventListener('drop', function(e) {
                e.preventDefault();
                if (this !== draggedItem) {
                    const allItems = [...sortableContainer.querySelectorAll('.sortable-product')];
                    const draggedIndex = allItems.indexOf(draggedItem);
                    const targetIndex = allItems.indexOf(this);
                    
                    if (draggedIndex < targetIndex) {
                        this.parentNode.insertBefore(draggedItem, this.nextSibling);
                    } else {
                        this.parentNode.insertBefore(draggedItem, this);
                    }
                    
                    this.style.borderTop = '';
                }
            });
        });
    }

    // Update product order after sorting
    function updateProductOrder() {
        const productItems = elements.sortableProducts.querySelectorAll('.sortable-product');
        
        productItems.forEach((item, index) => {
            const productId = item.dataset.id;
            const product = state.products.find(p => p.id === productId);
            if (product) {
                product.order = index;
            }
        });
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(state.products));
        
        // Save to Firebase
        state.products.forEach(product => {
            saveToFirebase('products', product, product.id);
        });
        
        // Re-render store products
        renderProducts();
    }

    // Handle WhatsApp order
    function handleWhatsAppOrder(e) {
        const product = JSON.parse(e.target.closest('button').dataset.product);
        const message = `مرحبًا، أريد طلب المنتج التالي:\n\nاسم المنتج: ${product.name}\nالسعر: ${product.price} ${state.currency}\n\nرابط الصورة: ${product.mediaUrl}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${state.whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    // Handle Instagram order
    function handleInstagramOrder(e) {
        const product = JSON.parse(e.target.closest('button').dataset.product);
        const message = `مرحبًا، أريد طلب المنتج: ${product.name} بسعر ${product.price} ${state.currency}`;
        
        // Instagram doesn't have a direct message API, so we'll open their app/site
        alert(`لطلب المنتج عبر إنستغرام:\n\n1. افتح إنستغرام\n2. ابحث عن ${state.instagramAccount}\n3. أرسل رسالة تحتوي على:\n${message}\n\nمع صورة المنتج`);
        
        // Open Instagram profile
        window.open(`https://instagram.com/${state.instagramAccount}`, '_blank');
    }

    // Add new product
    function addProduct() {
        // Reset form
        elements.productModalTitle.textContent = 'إضافة منتج جديد';
        elements.productName.value = '';
        elements.productPrice.value = '';
        elements.productDescription.value = '';
        elements.productMediaType.value = 'image';
        elements.productMediaUrl.value = '';
        elements.productCategory.value = 'عام';
        elements.editingProductId.value = '';
        
        // Show modal
        elements.productModal.classList.add('active');
    }

    // Edit product
    function editProduct(productId) {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;
        
        elements.productModalTitle.textContent = 'تعديل المنتج';
        elements.productName.value = product.name;
        elements.productPrice.value = product.price;
        elements.productDescription.value = product.description;
        elements.productMediaType.value = product.mediaType;
        elements.productMediaUrl.value = product.mediaUrl;
        elements.productCategory.value = product.category;
        elements.editingProductId.value = product.id;
        
        // Show modal
        elements.productModal.classList.add('active');
    }

    // Save product (add or update)
    function saveProduct() {
        const name = elements.productName.value.trim();
        const price = parseFloat(elements.productPrice.value);
        const description = elements.productDescription.value.trim();
        const mediaType = elements.productMediaType.value;
        const mediaUrl = elements.productMediaUrl.value.trim();
        const category = elements.productCategory.value;
        const productId = elements.editingProductId.value;
        
        // Validate
        if (!name || isNaN(price) || !description || !mediaUrl) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        // Check if adding new category
        if (category === 'add_new') {
            const newCategory = prompt('أدخل اسم القسم الجديد:');
            if (newCategory && newCategory.trim()) {
                state.categories.push(newCategory.trim());
                localStorage.setItem('categories', JSON.stringify(state.categories));
                populateCategories();
                // Set the new category as selected
                // We'll just use "عام" for now and ask user to select again
                alert('تم إضافة القسم الجديد. يرجى اختياره من القائمة.');
                return;
            } else {
                alert('لم يتم إضافة قسم جديد. يرجى اختيار قسم من القائمة.');
                return;
            }
        }
        
        if (productId) {
            // Update existing product
            const productIndex = state.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                state.products[productIndex] = {
                    ...state.products[productIndex],
                    name,
                    price,
                    description,
                    mediaType,
                    mediaUrl,
                    category
                };
                
                // Save to Firebase
                saveToFirebase('products', state.products[productIndex], productId);
            }
        } else {
            // Add new product
            const newProduct = {
                id: Date.now().toString(),
                name,
                price,
                description,
                mediaType,
                mediaUrl,
                category,
                order: state.products.length,
                visible: true
            };
            
            state.products.push(newProduct);
            
            // Save to Firebase
            saveToFirebase('products', newProduct, newProduct.id);
        }
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(state.products));
        
        // Re-render products
        renderProducts();
        renderVideos();
        
        // Hide modal
        elements.productModal.classList.remove('active');
    }

    // Delete product
    function deleteProduct(productId) {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
        
        // Remove from state
        state.products = state.products.filter(p => p.id !== productId);
        
        // Update order of remaining products
        state.products.forEach((product, index) => {
            product.order = index;
        });
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(state.products));
        
        // Delete from Firebase
        deleteFromFirebase('products', productId);
        
        // Re-render products
        renderProducts();
        renderVideos();
    }

    // Add new section
    function addSection() {
        const name = elements.newSectionName.value.trim();
        if (!name) {
            alert('يرجى إدخال اسم القسم');
            return;
        }
        
        // Generate ID from name (Arabic to English, lowercase, replace spaces)
        const id = name.replace(/[^\w\u0600-\u06FF]/g, '-').toLowerCase();
        
        // Check if section already exists
        if (state.sections.some(s => s.id === id)) {
            alert('القسم موجود بالفعل');
            return;
        }
        
        const newSection = {
            id,
            name,
            visible: true,
            order: state.sections.length
        };
        
        state.sections.push(newSection);
        
        // Save to localStorage
        localStorage.setItem('sections', JSON.stringify(state.sections));
        
        // Save to Firebase
        saveToFirebase('sections', newSection, id);
        
        // Clear input
        elements.newSectionName.value = '';
        
        // Re-render sections
        renderSections();
        
        // Show success message
        alert(`تم إضافة قسم "${name}" بنجاح`);
    }

    // Toggle section visibility
    function toggleSectionVisibility(sectionId) {
        const section = state.sections.find(s => s.id === sectionId);
        if (section) {
            section.visible = !section.visible;
            
            // Save to localStorage
            localStorage.setItem('sections', JSON.stringify(state.sections));
            
            // Save to Firebase
            saveToFirebase('sections', section, sectionId);
            
            // Re-render sections
            renderSections();
        }
    }

    // Delete section
    function deleteSection(sectionId) {
        // Don't allow deletion of core sections
        const coreSections = ['home', 'products', 'videos', 'comments', 'updates', 'contact', 'programmer'];
        if (coreSections.includes(sectionId)) {
            alert('لا يمكن حذف الأقسام الأساسية');
            return;
        }
        
        if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
        
        // Remove from state
        state.sections = state.sections.filter(s => s.id !== sectionId);
        
        // Update order of remaining sections
        state.sections.forEach((section, index) => {
            section.order = index;
        });
        
        // Save to localStorage
        localStorage.setItem('sections', JSON.stringify(state.sections));
        
        // Delete from Firebase
        deleteFromFirebase('sections', sectionId);
        
        // Re-render sections
        renderSections();
    }

    // Add new comment
    function addComment() {
        const content = elements.newCommentText.value.trim();
        if (!content) {
            alert('يرجى كتابة تعليق');
            return;
        }
        
        const newComment = {
            id: Date.now().toString(),
            author: 'زائر',
            content,
            date: new Date().toISOString().split('T')[0],
            pinned: false
        };
        
        state.comments.push(newComment);
        
        // Save to localStorage
        localStorage.setItem('comments', JSON.stringify(state.comments));
        
        // Save to Firebase
        saveToFirebase('comments', newComment, newComment.id);
        
        // Clear input
        elements.newCommentText.value = '';
        
        // Re-render comments
        renderComments();
        renderAdminComments();
    }

    // Delete comment
    function deleteComment(commentId) {
        if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
        
        // Remove from state
        state.comments = state.comments.filter(c => c.id !== commentId);
        
        // Save to localStorage
        localStorage.setItem('comments', JSON.stringify(state.comments));
        
        // Delete from Firebase
        deleteFromFirebase('comments', commentId);
        
        // Re-render comments
        renderComments();
        renderAdminComments();
        renderPinnedComments();
    }

    // Toggle pin comment
    function togglePinComment(commentId) {
        const comment = state.comments.find(c => c.id === commentId);
        if (comment) {
            comment.pinned = !comment.pinned;
            
            // Save to localStorage
            localStorage.setItem('comments', JSON.stringify(state.comments));
            
            // Save to Firebase
            saveToFirebase('comments', comment, commentId);
            
            // Re-render comments
            renderComments();
            renderAdminComments();
            renderPinnedComments();
        }
    }

    // Add new update
    function addUpdate() {
        const content = elements.newUpdateText.value.trim();
        if (!content) {
            alert('يرجى كتابة محتوى التحديث');
            return;
        }
        
        const newUpdate = {
            id: Date.now().toString(),
            content,
            date: new Date().toISOString().split('T')[0]
        };
        
        state.updates.push(newUpdate);
        
        // Save to localStorage
        localStorage.setItem('updates', JSON.stringify(state.updates));
        
        // Save to Firebase
        saveToFirebase('updates', newUpdate, newUpdate.id);
        
        // Clear input
        elements.newUpdateText.value = '';
        
        // Re-render updates
        renderUpdates();
        renderAdminUpdates();
    }

    // Delete update
    function deleteUpdate(updateId) {
        if (!confirm('هل أنت متأكد من حذف هذا التحديث؟')) return;
        
        // Remove from state
        state.updates = state.updates.filter(u => u.id !== updateId);
        
        // Save to localStorage
        localStorage.setItem('updates', JSON.stringify(state.updates));
        
        // Delete from Firebase
        deleteFromFirebase('updates', updateId);
        
        // Re-render updates
        renderUpdates();
        renderAdminUpdates();
    }

    // Save settings
    function saveSettings() {
        state.storeName = elements.storeNameInput.value.trim() || state.storeName;
        state.currency = elements.storeCurrency.value;
        state.language = elements.storeLanguage.value;
        state.primaryColor = elements.primaryColor.value;
        state.whatsappNumber = elements.whatsappNumber.value.trim() || state.whatsappNumber;
        state.instagramAccount = elements.instagramAccount.value.trim() || state.instagramAccount;
        
        // Apply changes
        applyTheme();
        loadStoreData();
        
        // Save to localStorage
        localStorage.setItem('storeName', state.storeName);
        localStorage.setItem('currency', state.currency);
        localStorage.setItem('language', state.language);
        localStorage.setItem('primaryColor', state.primaryColor);
        localStorage.setItem('whatsappNumber', state.whatsappNumber);
        localStorage.setItem('instagramAccount', state.instagramAccount);
        
        // Save to Firebase
        const settings = {
            storeName: state.storeName,
            currency: state.currency,
            language: state.language,
            primaryColor: state.primaryColor,
            whatsappNumber: state.whatsappNumber,
            instagramAccount: state.instagramAccount,
            updatedAt: new Date().toISOString()
        };
        
        saveToFirebase('settings', settings, 'store');
        
        // Show success message
        alert('تم حفظ الإعدادات بنجاح');
    }

    // Factory reset
    function factoryReset() {
        if (!confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟ سيتم فقد جميع التغييرات.')) return;
        
        // Reset state to defaults
        state.theme = 'light';
        state.storeName = 'متجر نقاشة سعودي';
        state.currency = 'SAR';
        state.language = 'ar';
        state.primaryColor = '#3a86ff';
        state.whatsappNumber = '966500000000';
        state.instagramAccount = 'nashasha_store';
        
        // Keep products, comments, updates, sections as they are
        
        // Apply changes
        applyTheme();
        loadStoreData();
        
        // Save to localStorage
        localStorage.setItem('theme', state.theme);
        localStorage.setItem('storeName', state.storeName);
        localStorage.setItem('currency', state.currency);
        localStorage.setItem('language', state.language);
        localStorage.setItem('primaryColor', state.primaryColor);
        localStorage.setItem('whatsappNumber', state.whatsappNumber);
        localStorage.setItem('instagramAccount', state.instagramAccount);
        
        // Show success message
        alert('تم استعادة الإعدادات الافتراضية بنجاح');
    }

    // Clear all data
    function clearAllData() {
        if (!confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) return;
        
        // Clear state
        state.products = [];
        state.comments = [];
        state.updates = [];
        state.categories = ['عام', 'إلكترونيات', 'عطور', 'مجوهرات', 'ملابس'];
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(state.products));
        localStorage.setItem('comments', JSON.stringify(state.comments));
        localStorage.setItem('updates', JSON.stringify(state.updates));
        localStorage.setItem('categories', JSON.stringify(state.categories));
        
        // Re-render everything
        renderProducts();
        renderVideos();
        renderComments();
        renderAdminComments();
        renderUpdates();
        renderAdminUpdates();
        renderPinnedComments();
        populateCategories();
        
        // Show success message
        alert('تم حذف جميع البيانات بنجاح');
    }

    // AI generate section
    function aiGenerateSection() {
        const aiSectionNames = [
            'العروض الخاصة',
            'الأكثر مبيعًا',
            'منتجات جديدة',
            'تخفيضات',
            'مجموعات مميزة',
            'هدايا وعروض ترويجية',
            'ماركات عالمية',
            'منتجات محلية'
        ];
        
        const randomName = aiSectionNames[Math.floor(Math.random() * aiSectionNames.length)];
        elements.newSectionName.value = randomName;
        
        // Show AI message
        alert(`اقترح الذكاء الاصطناعي اسم قسم جديد: "${randomName}". يمكنك تعديله أو إضافته كما هو.`);
    }

    // AI suggestions
    function setupAISuggestions() {
        document.querySelectorAll('.apply-ai-suggestion').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type;
                
                switch(type) {
                    case 'layout':
                        // Suggest layout by sorting products by price (low to high)
                        state.products.sort((a, b) => a.price - b.price);
                        state.products.forEach((product, index) => {
                            product.order = index;
                        });
                        
                        // Save and re-render
                        localStorage.setItem('products', JSON.stringify(state.products));
                        renderProducts();
                        renderAdminProducts();
                        
                        alert('اقترح الذكاء الاصطناعي ترتيب المنتجات من الأقل سعرًا إلى الأعلى');
                        break;
                        
                    case 'theme':
                        // Generate random theme
                        const colors = [
                            '#3a86ff', '#8338ec', '#ff006e', '#fb5607', '#ffbe0b',
                            '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#264653'
                        ];
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        
                        state.primaryColor = randomColor;
                        elements.primaryColor.value = randomColor;
                        applyTheme();
                        
                        alert(`أنشأ الذكاء الاصطناعي سمة جديدة باللون: ${randomColor}`);
                        break;
                        
                    case 'sections':
                        // Suggest new sections
                        const suggestedSections = ['العروض الخاصة', 'الأكثر مبيعًا', 'تخفيضات'];
                        let message = 'اقترح الذكاء الاصطناعي الأقسام التالية:\n\n';
                        
                        suggestedSections.forEach(section => {
                            message += `• ${section}\n`;
                        });
                        
                        message += '\nيمكنك إضافتها يدويًا من قسم إدارة الأقسام.';
                        alert(message);
                        break;
                }
            });
        });
    }

    // Check admin status
    function checkAdminStatus() {
        if (state.isAdmin) {
            elements.adminPanel.classList.remove('hidden');
        } else {
            elements.adminPanel.classList.add('hidden');
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Theme toggle
        elements.themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
            applyTheme();
        });
        
        // Admin access
        elements.adminAccessBtn.addEventListener('click', () => {
            elements.adminAccessModal.classList.add('active');
        });
        
        elements.submitAdminCode.addEventListener('click', () => {
            const code = elements.adminCodeInput.value;
            if (code === '2004') {
                state.isAdmin = true;
                localStorage.setItem('isAdmin', 'true');
                elements.adminPanel.classList.remove('hidden');
                elements.adminAccessModal.classList.remove('active');
                alert('مرحبًا بك في لوحة التحكم!');
            } else {
                alert('الرمز غير صحيح');
            }
        });
        
        elements.cancelAdminCode.addEventListener('click', () => {
            elements.adminAccessModal.classList.remove('active');
        });
        
        // Close admin panel
        elements.closeAdminPanel.addEventListener('click', () => {
            elements.adminPanel.classList.add('hidden');
        });
        
        // Mobile menu
        elements.mobileMenuBtn.addEventListener('click', () => {
            elements.mobileNav.classList.toggle('active');
        });
        
        // Mobile navigation links
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                elements.mobileNav.classList.remove('active');
                
                // Scroll to section
                const sectionId = link.dataset.section;
                const sectionElement = document.getElementById(`${sectionId}Section`);
                if (sectionElement) {
                    sectionElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Section toggles
        document.querySelectorAll('.section-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const sectionId = btn.dataset.section;
                toggleSectionVisibility(sectionId);
            });
        });
        
        // Add product button
        elements.addProductBtn.addEventListener('click', addProduct);
        
        // Product modal buttons
        elements.saveProductBtn.addEventListener('click', saveProduct);
        elements.cancelProductBtn.addEventListener('click', () => {
            elements.productModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        elements.productModal.addEventListener('click', (e) => {
            if (e.target === elements.productModal) {
                elements.productModal.classList.remove('active');
            }
        });
        
        elements.adminAccessModal.addEventListener('click', (e) => {
            if (e.target === elements.adminAccessModal) {
                elements.adminAccessModal.classList.remove('active');
            }
        });
        
        // Add section button
        elements.addSectionBtn.addEventListener('click', addSection);
        
        // AI generate section button
        elements.aiGenerateSectionBtn.addEventListener('click', aiGenerateSection);
        
        // Add comment button
        elements.submitCommentBtn.addEventListener('click', addComment);
        
        // Add update button
        elements.addUpdateBtn.addEventListener('click', addUpdate);
        
        // Settings buttons
        elements.saveSettingsBtn.addEventListener('click', saveSettings);
        elements.factoryResetBtn.addEventListener('click', factoryReset);
        elements.clearDataBtn.addEventListener('click', clearAllData);
        
        // Admin tabs
        elements.adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                elements.adminTabs.forEach(t => t.classList.remove('active'));
                elements.adminTabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // AI suggestions
        setupAISuggestions();
        
        // Handle category change in product modal
        elements.productCategory.addEventListener('change', function() {
            if (this.value === 'add_new') {
                // We'll handle this in saveProduct function
            }
        });
    }

    // Initialize the app
    init();
});
