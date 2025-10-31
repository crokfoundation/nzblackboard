window.addEventListener('load', () => {
    const canvas = document.getElementById('chalkboard');
    const ctx = canvas.getContext('2d');
    
    // 버튼 요소 가져오기
    const penBtn = document.getElementById('pen-btn');
    const eraserBtn = document.getElementById('eraser-btn');
    const clearBtn = document.getElementById('clear-btn');
    const dockButtons = [penBtn, eraserBtn]; // 활성/비활성 관리를 위한 배열

    // 그리기 상태 변수
    let isDrawing = false;
    let mode = 'pen'; // 'pen' 또는 'eraser'
    let lastX = 0;
    let lastY = 0;

    // 도구 설정 (필요에 따라 굵기 조절)
    const penColor = '#FFFFFF'; // 펜 색상 (분필색)
    const penWidth = 5;         // 펜 굵기
    const eraserWidth = 30;     // 지우개 굵기

    // 캔버스 크기를 창 크기에 맞게 조절하는 함수
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // 페이지 로드 시 및 창 크기 변경 시 캔버스 크기 조절
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 마우스/터치 이벤트에서 좌표를 가져오는 헬퍼 함수
    function getCoordinates(e) {
        if (e.touches && e.touches.length > 0) {
            // 터치 이벤트
            return [e.touches[0].clientX, e.touches[0].clientY];
        } else {
            // 마우스 이벤트
            return [e.clientX, e.clientY];
        }
    }

    // 그리기 시작 (마우스 다운 또는 터치 시작)
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }

    // 그리기 (마우스 이동 또는 터치 이동)
    function draw(e) {
        if (!isDrawing) return;

        // 터치 시 화면 스크롤 방지
        e.preventDefault(); 

        const [currentX, currentY] = getCoordinates(e);

        ctx.lineCap = 'round'; // 선 끝을 둥글게
        ctx.lineJoin = 'round'; // 선이 꺾이는 부분을 둥글게

        if (mode === 'pen') {
            // 펜 모드
            ctx.globalCompositeOperation = 'source-over'; // 일반 그리기 모드
            ctx.strokeStyle = penColor;
            ctx.lineWidth = penWidth;
        } else if (mode === 'eraser') {
            // 지우개 모드
            ctx.globalCompositeOperation = 'destination-out'; // 지우개 모드
            ctx.lineWidth = eraserWidth;
        }

        ctx.beginPath();
        ctx.moveTo(lastX, lastY); // 이전 위치에서
        ctx.lineTo(currentX, currentY); // 현재 위치까지
        ctx.stroke();

        // 현재 위치를 다음 시작 위치로 업데이트
        [lastX, lastY] = [currentX, currentY];
    }

    // 그리기 중지 (마우스 업 또는 터치 끝)
    function stopDrawing() {
        isDrawing = false;
    }

    // 활성 버튼 스타일을 업데이트하는 함수
    function setActiveButton(activeBtn) {
        dockButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // --- 이벤트 리스너 연결 ---

    // 1. 마우스 이벤트
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing); // 캔버스 밖으로 나가도 중지

    // 2. 터치 이벤트
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    // 3. Dock 버튼 이벤트
    penBtn.addEventListener('click', () => {
        mode = 'pen';
        setActiveButton(penBtn);
    });

    eraserBtn.addEventListener('click', () => {
        mode = 'eraser';
        setActiveButton(eraserBtn);
    });

    clearBtn.addEventListener('click', () => {
        // 캔버스 전체를 깨끗하게 지움
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // 초기 활성 버튼 설정
    setActiveButton(penBtn);
});
