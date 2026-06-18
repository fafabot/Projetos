window.addEventListener('scroll', function () {
    let header = document.querySelector('header');

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

let hamburger = document.querySelector('.hamburger');
let navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function () {
    navMenu.classList.toggle('active');

    let spans = hamburger.querySelectorAll('span');

    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Fechar menu ao clicar em um link
let links = document.querySelectorAll('.nav-menu a');

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
        navMenu.classList.remove('active');
    });
}

// FAQ Acordeão
let faqItems = document.querySelectorAll('.faq-item');

for (let i = 0; i < faqItems.length; i++) {
    let question = faqItems[i].querySelector('.faq-question');

    question.addEventListener('click', function () {
        let item = this.parentElement;
        let answer = item.querySelector('.faq-answer');
        let aberto = item.classList.contains('active');

        for (let j = 0; j < faqItems.length; j++) {
            faqItems[j].classList.remove('active');
            faqItems[j].querySelector('.faq-answer').style.maxHeight = null;
        }

        if (!aberto) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
}