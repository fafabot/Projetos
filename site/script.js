// Efeito de Header Fixo ao Rolar
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Menu Hamburguer Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Animação simples do ícone hamburguer
    const spans = hamburger.querySelectorAll('span');
    spans.style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
    spans[6].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[5].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// FAQ Acordeão
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Fecha outros itens (opcional - comportamento acordeão)
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
        });

        if (!isOpen) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// Scroll Reveal usando Intersection Observer
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active-reveal');
        }
    });
}, observerOptions);

// Selecionar todos os elementos para animar
const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-slide-left');
revealElements.forEach(el => observer.observe(el));

// Comentário: A estrutura acima garante que os elementos apareçam suavemente conforme o usuário navega.