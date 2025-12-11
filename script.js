document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeSidebarBtn.addEventListener('click', function() {
        mobileSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileSidebar.classList.contains('active') && 
            !mobileSidebar.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            mobileSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Day/Night Mode Toggle (icon only)
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or respect OS setting
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    }
    
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Notification Panel Toggle
    const viewAllMobileBtn = document.querySelector('.view-all-mobile');
    const notificationBtn = document.querySelector('.view-all-btn');
    const notificationPanel = document.getElementById('notification-panel');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    
    // Open notification panel from mobile view
    if (viewAllMobileBtn) {
        viewAllMobileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
            openNotificationPanel();
        });
    }
    
    // Open notification panel from notification view all button
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openNotificationPanel();
        });
    }
    
    function openNotificationPanel() {
        notificationPanel.classList.add('active');
        
        // Mark all as read when opening notifications
        document.querySelectorAll('.notification-item.unread, .notification-item-mobile.unread').forEach(item => {
            item.classList.remove('unread');
        });
    }
    
    // Close notification panel when clicking outside
    document.addEventListener('click', function(event) {
        if (notificationPanel.classList.contains('active') && 
            !notificationPanel.contains(event.target) && 
            !viewAllMobileBtn?.contains(event.target) && 
            !notificationBtn?.contains(event.target)) {
            notificationPanel.classList.remove('active');
        }
    });
    
    // Mark all notifications as read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            document.querySelectorAll('.notification-item.unread, .notification-item-mobile.unread').forEach(item => {
                item.classList.remove('unread');
            });
        });
    }
    
    // Sidebar Navigation
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav li');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    // Handle sidebar navigation clicks
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all sidebar items
            sidebarNavItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide mobile sidebar
            mobileSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Get the page ID from data attribute
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Handle bottom navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items and pages
            navItems.forEach(nav => nav.classList.remove('active'));
            sidebarNavItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Also update the sidebar navigation
            const page = this.getAttribute('data-page');
            document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
            
            // Show corresponding page
            document.getElementById(page + '-page').classList.add('active');
            
            // Update sidebar navigation
            document.querySelector(`.sidebar-nav li[data-page="${page}"]`)?.classList.add('active');
        });
    });
    
    // Function to navigate to a page
    function navigateToPage(pageId) {
        // Remove active class from all navigation items
        navItems.forEach(nav => nav.classList.remove('active'));
        sidebarNavItems.forEach(nav => nav.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        // Add active class to the corresponding bottom nav item
        const bottomNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (bottomNavItem) {
            bottomNavItem.classList.add('active');
        }
        
        // Add active class to the corresponding sidebar nav item
        const sidebarNavItem = document.querySelector(`.sidebar-nav li[data-page="${pageId}"]`);
        if (sidebarNavItem) {
            sidebarNavItem.classList.add('active');
        }
        
        // Show the page with "-page" suffix
        const pageElement = document.getElementById(pageId + '-page');
        if (pageElement) {
            pageElement.classList.add('active');
        }
    }
    
    // Initialize with home page active
    document.getElementById('home-page').classList.add('active');
    document.querySelector('[data-page="home"]').classList.add('active');
    document.querySelector('.sidebar-nav li[data-page="home"]').classList.add('active');
    
    // Initialize theme mode display
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            themeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.textContent === 'Dark') {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                themeIcon.className = 'fas fa-sun';
            } else if (this.textContent === 'Light') {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                themeIcon.className = 'fas fa-moon';
            } else {
                // System preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.body.classList.add('dark-mode');
                    themeIcon.className = 'fas fa-sun';
                } else {
                    document.body.classList.remove('dark-mode');
                    themeIcon.className = 'fas fa-moon';
                }
                localStorage.removeItem('theme');
            }
        });
    });
    
    // Stream selection functionality
    const streamCards = document.querySelectorAll('.stream-card');
    streamCards.forEach(card => {
        card.addEventListener('click', function() {
            // Check if this is for courses or exams based on parent section
            const parentSection = this.closest('section');
            const isExamBank = parentSection.id === 'exam-bank-page';
            
            // Remove selected class from all cards in this section
            parentSection.querySelectorAll('.stream-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Get the stream type
            const stream = this.getAttribute('data-stream');
            
            // Show appropriate grid based on section
            if (isExamBank) {
                showExamCoursesForStream(stream);
            } else {
                showCoursesForStream(stream);
            }
        });
    });
    
    // Back buttons
    const backToStreamsBtn = document.getElementById('back-to-streams');
    const backToCoursesBtn = document.getElementById('back-to-courses');
    const backToExamStreamsBtn = document.getElementById('back-to-exam-streams');
    const backToExamCoursesBtn = document.getElementById('back-to-exam-courses');
    
    if (backToStreamsBtn) {
        backToStreamsBtn.addEventListener('click', function() {
            // Hide course grid and detail pages
            document.getElementById('courses-grid-page').classList.remove('active');
            document.getElementById('course-detail-page').classList.remove('active');
            
            // Show modules page with stream selection
            document.getElementById('modules-page').classList.add('active');
            
            // Update navigation
            navItems.forEach(nav => nav.classList.remove('active'));
            sidebarNavItems.forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-page="modules"]').classList.add('active');
            document.querySelector('.sidebar-nav li[data-page="modules"]').classList.add('active');
        });
    }
    
    if (backToCoursesBtn) {
        backToCoursesBtn.addEventListener('click', function() {
            document.getElementById('course-detail-page').classList.remove('active');
            document.getElementById('courses-grid-page').classList.add('active');
        });
    }
    
    if (backToExamStreamsBtn) {
        backToExamStreamsBtn.addEventListener('click', function() {
            // Hide exam course grid and detail pages
            document.getElementById('exam-courses-grid-page').classList.remove('active');
            document.getElementById('exam-detail-page').classList.remove('active');
            
            // Show exam bank page with stream selection
            document.getElementById('exam-bank-page').classList.add('active');
            
            // Update navigation
            navItems.forEach(nav => nav.classList.remove('active'));
            sidebarNavItems.forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-page="exam-bank"]').classList.add('active');
            document.querySelector('.sidebar-nav li[data-page="exam-bank"]').classList.add('active');
        });
    }
    
    if (backToExamCoursesBtn) {
        backToExamCoursesBtn.addEventListener('click', function() {
            document.getElementById('exam-detail-page').classList.remove('active');
            document.getElementById('exam-courses-grid-page').classList.add('active');
        });
    }
    
    // Course action buttons
    const courseActionBtns = document.querySelectorAll('.course-action-btn');
    courseActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseName = this.closest('.academic-course-card').querySelector('h3').textContent;
            const parentSection = this.closest('section');
            const isExamBank = parentSection.id === 'exam-courses-grid-page';
            
            if (isExamBank) {
                showExamDetail(courseName);
            } else {
                showCourseDetail(courseName);
            }
        });
    });
    
    // Function to show courses for a stream
    function showCoursesForStream(stream) {
        const streamTitle = document.getElementById('stream-title');
        const streamDescription = document.getElementById('stream-description');
        
        // Set stream title and description
        if (stream === 'natural') {
            streamTitle.textContent = 'Natural Science Stream';
            streamDescription.textContent = 'Comprehensive curriculum for science-focused students';
        } else {
            streamTitle.textContent = 'Social Science Stream';
            streamDescription.textContent = 'Comprehensive curriculum for humanities-focused students';
        }
        
        // Hide stream selection and show courses grid
        document.getElementById('modules-page').classList.remove('active');
        document.getElementById('courses-grid-page').classList.add('active');
        
        // Update navigation
        navItems.forEach(nav => nav.classList.remove('active'));
        sidebarNavItems.forEach(nav => nav.classList.remove('active'));
        document.querySelector('[data-page="modules"]').classList.add('active');
        document.querySelector('.sidebar-nav li[data-page="modules"]').classList.add('active');
    }
    
    // Function to show exam courses for a stream
    function showExamCoursesForStream(stream) {
        const examStreamTitle = document.getElementById('exam-stream-title');
        const examStreamDescription = document.getElementById('exam-stream-description');
        
        // Set stream title and description
        if (stream === 'natural') {
            examStreamTitle.textContent = 'Natural Science Stream';
            examStreamDescription.textContent = 'Exam preparation materials for science students';
        } else {
            examStreamTitle.textContent = 'Social Science Stream';
            examStreamDescription.textContent = 'Exam preparation materials for humanities students';
        }
        
        // Hide stream selection and show exam courses grid
        document.getElementById('exam-bank-page').classList.remove('active');
        document.getElementById('exam-courses-grid-page').classList.add('active');
        
        // Update navigation
        navItems.forEach(nav => nav.classList.remove('active'));
        sidebarNavItems.forEach(nav => nav.classList.remove('active'));
        document.querySelector('[data-page="exam-bank"]').classList.add('active');
        document.querySelector('.sidebar-nav li[data-page="exam-bank"]').classList.add('active');
    }
    
    // Function to show course detail
    function showCourseDetail(courseName) {
        // Update course title
        document.getElementById('course-title').textContent = courseName;
        
        // Define modules and resources for each course
        const courseContent = {
            'Mathematics': {
                modules: [
                    { title: 'Algebra Fundamentals', description: 'Master equations, functions, and inequalities' },
                    { title: 'Geometry & Trigonometry', description: 'Study shapes, angles, and trigonometric functions' },
                    { title: 'Calculus Introduction', description: 'Understand derivatives and integrals' },
                    { title: 'Statistics & Probability', description: 'Learn data analysis and probability concepts' }
                ],
                resources: [
                    'Formula Reference Sheet',
                    'Practice Problem Sets (Chapter 1-5)',
                    'Graphing Calculator Guide',
                    'Exam Preparation Checklist'
                ]
            },
            'Biology': {
                modules: [
                    { title: 'Cell Biology', description: 'Study cellular structure, function, and processes' },
                    { title: 'Genetics', description: 'Learn about DNA, inheritance patterns, and genetic engineering' },
                    { title: 'Ecology', description: 'Understand ecosystems, biodiversity, and environmental interactions' },
                    { title: 'Human Physiology', description: 'Study body systems and their functions' }
                ],
                resources: [
                    'Cell Structure Diagrams',
                    'Genetic Inheritance Charts',
                    'Ecology Field Study Guide',
                    'Physiology Reference Manual'
                ]
            },
            'Physics': {
                modules: [
                    { title: 'Mechanics', description: 'Study motion, forces, energy, and momentum' },
                    { title: 'Electricity & Magnetism', description: 'Learn about electric fields, circuits, and magnetic forces' },
                    { title: 'Waves & Optics', description: 'Understand wave properties and light behavior' },
                    { title: 'Modern Physics', description: 'Explore quantum mechanics and relativity' }
                ],
                resources: [
                    'Physics Formula Sheet',
                    'Circuit Diagram Templates',
                    'Wave Properties Reference',
                    'Laboratory Procedures Guide'
                ]
            },
            'Chemistry': {
                modules: [
                    { title: 'Atomic Structure', description: 'Learn about atoms, electron configuration, and periodic trends' },
                    { title: 'Chemical Bonding', description: 'Understand ionic, covalent, and metallic bonds' },
                    { title: 'Organic Chemistry', description: 'Study carbon compounds and their reactions' },
                    { title: 'Chemical Reactions', description: 'Learn types of reactions and stoichiometry' }
                ],
                resources: [
                    'Periodic Table Reference',
                    'Bonding Visualization Tools',
                    'Organic Reaction Mechanisms',
                    'Laboratory Safety Guidelines'
                ]
            },
            'English': {
                modules: [
                    { title: 'Literary Analysis', description: 'Learn to analyze poems, novels, and plays' },
                    { title: 'Essay Writing', description: 'Master different essay structures and writing techniques' },
                    { title: 'Grammar & Syntax', description: 'Understand advanced grammar rules and sentence structure' },
                    { title: 'Critical Reading', description: 'Develop skills for analyzing complex texts' }
                ],
                resources: [
                    'Literary Devices Glossary',
                    'Essay Structure Templates',
                    'Grammar Rules Reference',
                    'Reading Comprehension Strategies'
                ]
            }
        };
        
        // Get content for the selected course
        const content = courseContent[courseName] || courseContent['Mathematics'];
        
        // Populate modules grid
        const modulesGrid = document.getElementById('modules-grid');
        modulesGrid.innerHTML = '';
        
        content.modules.forEach(module => {
            const moduleElement = document.createElement('div');
            moduleElement.className = 'module-card';
            moduleElement.innerHTML = `
                <h3>${module.title}</h3>
                <p>${module.description}</p>
            `;
            moduleElement.addEventListener('click', function() {
                alert(`Opening module: ${module.title}\n\nThis would load the full module content in a real application.`);
            });
            modulesGrid.appendChild(moduleElement);
        });
        
        // Populate resources list
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';
        
        content.resources.forEach(resource => {
            const resourceElement = document.createElement('div');
            resourceElement.className = 'note-item';
            resourceElement.innerHTML = `
                <i class="fas fa-file-pdf"></i>
                <span>${resource}</span>
                <i class="fas fa-download download-icon"></i>
            `;
            resourceElement.addEventListener('click', function() {
                alert(`Downloading: ${resource}\n\nThis would trigger a file download in a real application.`);
            });
            notesList.appendChild(resourceElement);
        });
        
        // Hide courses grid and show course detail
        document.getElementById('courses-grid-page').classList.remove('active');
        document.getElementById('course-detail-page').classList.add('active');
    }
    
    // Function to show exam detail
    function showExamDetail(courseName) {
        // Update exam course title
        document.getElementById('exam-course-title').textContent = courseName;
        
        // Define mid exams and final exams for each course
        const examContent = {
            'Mathematics': {
                midExams: [
                    { title: 'Algebra & Functions Test', questions: 25, duration: '45 mins', status: 'not-started' },
                    { title: 'Geometry Fundamentals', questions: 20, duration: '40 mins', status: 'in-progress' },
                    { title: 'Trigonometry Assessment', questions: 18, duration: '35 mins', status: 'completed' }
                ],
                finalExams: [
                    { title: 'Mathematics Comprehensive Final', questions: 50, duration: '120 mins', status: 'not-started' },
                    { title: 'Calculus Midterm Preparation', questions: 30, duration: '90 mins', status: 'not-started' },
                    { title: 'Statistics & Probability Final', questions: 35, duration: '100 mins', status: 'not-started' }
                ]
            },
            'Biology': {
                midExams: [
                    { title: 'Cell Structure & Function', questions: 30, duration: '45 mins', status: 'in-progress' },
                    { title: 'Genetics Fundamentals', questions: 25, duration: '40 mins', status: 'not-started' },
                    { title: 'Ecology Principles', questions: 20, duration: '35 mins', status: 'not-started' }
                ],
                finalExams: [
                    { title: 'Biology Comprehensive Final', questions: 60, duration: '120 mins', status: 'not-started' },
                    { title: 'Human Physiology Assessment', questions: 40, duration: '90 mins', status: 'not-started' },
                    { title: 'Molecular Biology Final', questions: 35, duration: '100 mins', status: 'not-started' }
                ]
            },
            'Physics': {
                midExams: [
                    { title: 'Mechanics Fundamentals', questions: 28, duration: '50 mins', status: 'not-started' },
                    { title: 'Thermodynamics Test', questions: 22, duration: '45 mins', status: 'not-started' },
                    { title: 'Waves & Optics Midterm', questions: 25, duration: '40 mins', status: 'not-started' }
                ],
                finalExams: [
                    { title: 'Physics Comprehensive Final', questions: 55, duration: '150 mins', status: 'not-started' },
                    { title: 'Electricity & Magnetism Assessment', questions: 35, duration: '100 mins', status: 'not-started' },
                    { title: 'Modern Physics Final', questions: 30, duration: '90 mins', status: 'not-started' }
                ]
            }
        };
        
        // Get content for the selected course
        const content = examContent[courseName] || examContent['Mathematics'];
        
        // Populate mid exams grid
        const midExamsGrid = document.getElementById('mid-exams-grid');
        midExamsGrid.innerHTML = '';
        
        content.midExams.forEach(exam => {
            const statusClass = `status-${exam.status}`;
            const statusText = exam.status.replace('-', ' ').toUpperCase();
            
            const examElement = document.createElement('div');
            examElement.className = 'exam-card';
            examElement.innerHTML = `
                <h3><i class="fas fa-file-medical"></i> ${exam.title}</h3>
                <p>${exam.questions} questions • ${exam.duration}</p>
                <div class="exam-stats">
                    <span>Difficulty: Medium</span>
                    <span class="exam-status ${statusClass}">${statusText}</span>
                </div>
            `;
            examElement.addEventListener('click', function() {
                handleExamStart(exam.title, 'Mid Term');
            });
            midExamsGrid.appendChild(examElement);
        });
        
        // Populate final exams grid
        const finalExamsGrid = document.getElementById('final-exams-grid');
        finalExamsGrid.innerHTML = '';
        
        content.finalExams.forEach(exam => {
            const statusClass = `status-not-started`;
            const statusText = 'NOT STARTED';
            
            const examElement = document.createElement('div');
            examElement.className = 'exam-card';
            examElement.innerHTML = `
                <h3><i class="fas fa-certificate"></i> ${exam.title}</h3>
                <p>${exam.questions} questions • ${exam.duration}</p>
                <div class="exam-stats">
                    <span>Difficulty: Hard</span>
                    <span class="exam-status ${statusClass}">${statusText}</span>
                </div>
            `;
            examElement.addEventListener('click', function() {
                handleExamStart(exam.title, 'Final');
            });
            finalExamsGrid.appendChild(examElement);
        });
        
        // Hide exam courses grid and show exam detail
        document.getElementById('exam-courses-grid-page').classList.remove('active');
        document.getElementById('exam-detail-page').classList.add('active');
    }
    
    // Function to handle exam start
    function handleExamStart(examTitle, examType) {
        const confirmation = confirm(`Are you ready to start the ${examType} Exam: "${examTitle}"?\n\nThis exam will be timed and you won't be able to pause once started.`);
        
        if (confirmation) {
            alert(`Starting exam: ${examTitle}\n\nIn a real application, this would launch the exam interface with a timer and questions.`);
        }
    }
    
    // Add click event listeners to notification items
    document.querySelectorAll('.notification-item, .notification-item-mobile').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            // In a real app, this would navigate to the relevant section
            alert(`Viewing details for: ${title}\n\nThis would open the relevant academic content in a real application.`);
        });
    });
    
    // Font size adjustment
    const fontBtns = document.querySelectorAll('.font-btn');
    fontBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            fontBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // In a real app, this would adjust the font size site-wide
        });
    });
});