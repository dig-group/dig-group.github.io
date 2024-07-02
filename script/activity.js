let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-images img');
const totalSlides = slides.length;

function showSlide(index) {
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    const carouselWidth = document.querySelector('.carousel').offsetWidth;
    const newTransformValue = -carouselWidth * currentSlide;
    document.querySelector('.carousel-images').style.transform = `translateX(${newTransformValue}px)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// 自动轮播定时器，每隔8秒切换到下一张图片
setInterval(nextSlide, 8000);

// 初始化轮播图显示第一张图片
showSlide(currentSlide);
