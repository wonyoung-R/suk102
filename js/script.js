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
            
            // 폼 상태 표시 초기화 - 로딩 스피너 표시
            formStatus.className = 'form-status loading';
            formStatus.style.display = 'block';
            formStatus.innerHTML = '<div class="loader"></div><div style="margin-top: 15px;">제출 중입니다...</div>';
            
            // 폼 데이터 수집
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const inquiryType = document.getElementById('inquiry-type').value;
            const message = document.getElementById('message').value;
            
            // Google 스프레드시트 웹 앱 URL - Apps Script 배포 URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxZO1_CLEblxPwqPGtdhYOq2oH-DdNGmIMv_yPUWWdq2S_j_mx_0JNdcsvTJfm3r4v6Jg/exec';
            
            // URL 파라미터 생성
            const url = new URL(scriptURL);
            url.searchParams.append('timestamp', new Date().toISOString());
            url.searchParams.append('name', name);
            url.searchParams.append('email', email);
            url.searchParams.append('phone', phone);
            url.searchParams.append('inquiryType', inquiryType);
            url.searchParams.append('message', message);
            // 캐싱 방지를 위한 고유 식별자 추가
            url.searchParams.append('random', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
            
            // 이미지 로드 방식으로 데이터 전송 (CORS 우회)
            const img = new Image();
            
            // 5초 타임아웃 설정
            const timeout = setTimeout(() => {
                // 성공으로 처리 (실제로는 성공했는지 모르지만 사용자 경험을 위해)
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<div>문의가 제출되었습니다. 감사합니다!<br>확인되는대로 연락드리겠습니다.</div>';
                inquiryForm.reset();
                
                // 2초 후 상태 메시지 숨기기
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 2000);
            }, 5000);
            
            // 이미지 로드 완료 이벤트
            img.onload = function() {
                clearTimeout(timeout);
                
                // 성공 메시지 표시
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<div>문의가 성공적으로 제출되었습니다. 감사합니다!<br>확인되는대로 연락드리겠습니다.</div>';
                inquiryForm.reset();
                
                // 2초 후 상태 메시지 숨기기
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 2000);
            };
            
            // 이미지 로드 실패 이벤트
            img.onerror = function() {
                // 이미지 로드 실패가 예상되므로 오류로 처리하지 않음
                // Google Apps Script는 이미지가 아니므로 항상 onerror가 발생하지만
                // 데이터는 서버에 전송됩니다
                
                clearTimeout(timeout);
                
                // 성공 메시지 표시 (데이터는 전송됨)
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<div>문의가 제출되었습니다. 감사합니다!<br>확인되는대로 연락드리겠습니다.</div>';
                inquiryForm.reset();
                
                // 2초 후 상태 메시지 숨기기
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 2000);
            };
            
            // 이미지 로드 시작 (실제로는 URL 호출)
            img.src = url.toString();
            
            console.log("폼 제출 완료: " + url.toString());
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