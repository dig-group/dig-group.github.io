const carouselIndices = {}; // 存储每个轮播图的当前索引

function showSlide(carouselId, index) {
    const carousel = document.querySelector(`.carousel[data-carousel-id="${carouselId}"]`);
    if (!carousel) return; // 确保 carousel 存在

    const slides = carousel.querySelectorAll('.carousel-images img');
    const totalSlides = slides.length;

    // 更新当前索引
    if (index >= totalSlides) {
        carouselIndices[carouselId] = 0;
    } else if (index < 0) {
        carouselIndices[carouselId] = totalSlides - 1;
    } else {
        carouselIndices[carouselId] = index;
    }

    const carouselWidth = carousel.offsetWidth;
    const newTransformValue = -carouselWidth * carouselIndices[carouselId];
    carousel.querySelector('.carousel-images').style.transform = `translateX(${newTransformValue}px)`;
}

function nextSlide(event) {
    const carousel = event.target.closest('.carousel');
    if (!carousel) return; // 检查 carousel 是否为 null
    const carouselId = carousel.getAttribute('data-carousel-id');
    showSlide(carouselId, carouselIndices[carouselId] + 1);
}

function prevSlide(event) {
    const carousel = event.target.closest('.carousel');
    if (!carousel) return; // 检查 carousel 是否为 null
    const carouselId = carousel.getAttribute('data-carousel-id');
    showSlide(carouselId, carouselIndices[carouselId] - 1);
}

// 自动轮播定时器，每隔8秒切换到下一张图片
setInterval(() => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const carouselId = carousel.getAttribute('data-carousel-id');
        nextSlide({ target: carousel.querySelector('.next') });
    });
}, 8000);

// 初始化所有轮播图
document.querySelectorAll('.carousel').forEach(carousel => {
    const carouselId = carousel.getAttribute('data-carousel-id');
    carouselIndices[carouselId] = 0; // 初始化索引
    showSlide(carouselId, carouselIndices[carouselId]); // 显示第一张图片
});
