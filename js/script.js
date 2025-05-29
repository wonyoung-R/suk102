document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션바 스크롤 효과
    const navbar = document.getElementById('navbar');
    const navHeight = navbar.offsetHeight;
    
    // 스크롤 변화 감지 및 적용 함수
    function checkScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // 페이지 로드 시 초기 스크롤 위치 확인
    checkScroll();
    
    // 스크롤 이벤트에 함수 연결
    window.addEventListener('scroll', checkScroll);

    // 모바일 메뉴 토글
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }

    // 네비게이션 링크 클릭시 스크롤 애니메이션
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모바일 메뉴 닫기
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const position = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 갤러리 필터링
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 활성화 버튼 변경
                filterBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // 필터링
                const filter = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 문의 폼 제출 이벤트
    const inquiryForm = document.getElementById('inquiry-form');
    const formStatus = document.getElementById('form-status');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 상태 표시 초기화
            formStatus.style.display = 'block';
            formStatus.innerHTML = '<div style="color: #666;">제출 중입니다...</div>';
            
            // 폼 데이터 수집
            const formData = {
                timestamp: new Date().toISOString(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                inquiryType: document.getElementById('inquiry-type').value,
                message: document.getElementById('message').value
            };
            
            // Google 스프레드시트 웹 앱 URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyLtjbGrAG0vCz2-vG67bBZMBR_h8NZ_tG3A2rZuFaTh9M8pqn3fC32XCvI5oXIE3xT/exec';
            
            // 데이터 전송
            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('제출 중 오류가 발생했습니다.');
                }
            })
            .then(data => {
                formStatus.innerHTML = '<div style="color: green;">문의가 성공적으로 제출되었습니다. 감사합니다!</div>';
                inquiryForm.reset();
                
                // 3초 후 상태 메시지 숨기기
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.innerHTML = '<div style="color: red;">문의 제출 중 오류가 발생했습니다. 나중에 다시 시도해주세요.</div>';
            });
        });
    }

    // Intersection Observer를 사용한 섹션 애니메이션
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
        
        // 초기 상태 설정 (CSS에서 활용)
        section.classList.add('section-ready');
    });

    // 갤러리 아이템 애니메이션
    const galleryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('gallery-item-animate');
                }, entry.target.dataset.delay || 0);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.dataset.delay = index * 100;
        galleryObserver.observe(item);
        
        // 초기 상태 설정
        item.classList.add('gallery-item-ready');
    });

    // 갤러리 아이템 클릭 이벤트 (모달 대신 간단한 효과)
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const overlay = this.querySelector('.item-overlay');
            
            if (overlay.style.transform === 'translateY(0px)') {
                overlay.style.transform = '';
            } else {
                overlay.style.transform = 'translateY(0)';
            }
        });
    });
}); 