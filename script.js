'use strict';
document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const setMenu = (open) => {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
};
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 721px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector('#project-type').value = link.dataset.service;
  });
});

const email = 'mayankg1609@gmail.com';
const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
let copyReset;
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = 'Email address copied.';
    copyButton.firstChild.textContent = 'Email copied ';
    clearTimeout(copyReset);
    copyReset = setTimeout(() => { copyButton.firstChild.textContent = 'Copy email '; }, 3000);
  } catch {
    copyStatus.textContent = `Copy this address: ${email}`;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.contact-email'));
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.firstChild.textContent = 'Select & copy email ';
  }
});

document.querySelector('#project-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const service = document.querySelector('#project-type').value;
  const messageField = document.querySelector('#project-message');
  const message = messageField.value.trim();
  if (!message) {
    messageField.setCustomValidity('Please add a few words about your project.');
    messageField.reportValidity();
    return;
  }
  messageField.setCustomValidity('');
  const subject = `Project enquiry: ${service}`;
  const body = `Hi Mayank,\n\nI'm looking for help with ${service.toLowerCase()}.\n\n${message}\n\nThanks!`;
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('.form-status').hidden = false;
});
document.querySelector('#project-message').addEventListener('input', (event) => {
  event.target.setCustomValidity('');
});
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main > section[id]')];
  const links = [...navigation.querySelectorAll('a')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}
