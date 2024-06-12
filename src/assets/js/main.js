/*=============== FEATURED SWIPER ===============*/
let swiperFeatured = new Swiper(".featured__swiper", {
    loop: true,
    spaceBetween: 16,
    grabCursor: true,
    slidesPerView: "auto",
    centeredSlides: "auto",
  
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  
    breakpoints: {
      1150: {
        slidesPerView: 4,
        centeredSlides: false,
      },
    },
  });
  