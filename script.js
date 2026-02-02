document.addEventListener('DOMContentLoaded', () => {
    // Initial FAQ Data
    const initialFaqs = [
        {
            id: 1,
            question: "How do I create an account?",
            answer: "To create an account, click on the 'Sign Up' button in the top right corner and follow the instructions.",
            category: "Account"
        },
        {
            id: 2,
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers.",
            category: "Payments"
        },
        {
            id: 3,
            question: "How can I reset my password?",
            answer: "Go to the login page and click on 'Forgot Password'. You will receive an email with instructions to reset it.",
            category: "Account"
        },
        {
            id: 4,
            question: "Is there technical support available 24/7?",
            answer: "Yes, our technical support team is available 24/7 via live chat and email.",
            category: "Technical Support"
        }
    ];

    // State
    let faqs = JSON.parse(localStorage.getItem('faqs')) || initialFaqs;
    let currentCategory = 'all';
    let searchQuery = '';

    // Elements
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const accordionContainer = document.getElementById('faq-accordion');
    const searchInput = document.getElementById('faq-search');
    const categoryButtons = document.querySelectorAll('.filter-btn');
    const addFaqForm = document.getElementById('add-faq-form');
    const noResults = document.getElementById('no-results');

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Functions
    const renderFaqs = () => {
        accordionContainer.innerHTML = '';

        const filteredFaqs = faqs.filter(faq => {
            const matchesCategory = currentCategory === 'all' || faq.category === currentCategory;
            const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredFaqs.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
            filteredFaqs.forEach(faq => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.innerHTML = `
                    <button class="faq-question">
                        <span>${highlightText(faq.question, searchQuery)}</span>
                        <span class="faq-icon"></span>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            ${highlightText(faq.answer, searchQuery)}
                            <br>
                            <span class="category-tag">${faq.category}</span>
                        </div>
                    </div>
                `;

                faqItem.querySelector('.faq-question').addEventListener('click', () => {
                    const isActive = faqItem.classList.contains('active');

                    // Close all other items
                    document.querySelectorAll('.faq-item').forEach(item => {
                        item.classList.remove('active');
                    });

                    // Toggle current item
                    if (!isActive) {
                        faqItem.classList.add('active');
                    }
                });

                accordionContainer.appendChild(faqItem);
            });
        }
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('faqs', JSON.stringify(faqs));
    };

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderFaqs();
    });

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderFaqs();
        });
    });

    addFaqForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newFaq = {
            id: Date.now(),
            question: document.getElementById('faq-question').value,
            answer: document.getElementById('faq-answer').value,
            category: document.getElementById('faq-category').value
        };

        faqs.push(newFaq);
        saveToLocalStorage();
        renderFaqs();
        addFaqForm.reset();

        // Scroll to the new FAQ or show success (optional)
        alert('FAQ added successfully!');
    });

    // Initial render
    renderFaqs();
});
