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
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });

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
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 모든 active 클래스 제거
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            
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

    // 폼 제출 처리
    const form = document.getElementById('inquiry-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                inquiryType: document.getElementById('inquiry-type').value,
                message: document.getElementById('message').value
            };
            
            // 폼 제출 성공 메시지 표시 (실제 서버 전송은 생략)
            alert('문의가 성공적으로 제출되었습니다. 곧 연락드리겠습니다.');
            
            // 폼 초기화
            form.reset();
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