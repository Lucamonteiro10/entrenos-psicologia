/**
 * ENTRE NÓS PSICOLOGIA — THAMIRES MONTEIRO AVELAR
 * Interatividades e Lógica de Navegação
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração padrão de contato (WhatsApp da clínica)
  // Thamires Monteiro Avelar - Entre Nós Psicologia
  const CLINIC_PHONE = '5531988168477'; // (31) 98816-8477

  // =========================================================================
  // 1. NAVBAR SCROLL EFFECT & MOBILE MENU
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // =========================================================================
  // 2. SCROLL REVEAL COM INTERSECTION OBSERVER
  // =========================================================================
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback para navegadores legados
    reveals.forEach(element => element.classList.add('active'));
  }

  // =========================================================================
  // 3. FAQ ACCORDION
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros itens
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Alterna o estado do item atual
      if (!isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });

  // =========================================================================
  // 4. GUIA INTERATIVO DE ACOLHIMENTO ("A TERAPIA É PARA VOCÊ?")
  // =========================================================================
  const checkItems = document.querySelectorAll('.check-item');
  const resultContainer = document.getElementById('assessmentFeedback');
  const resultText = document.getElementById('assessmentDynamicText');
  const resultActionBtn = document.getElementById('assessmentActionBtn');

  checkItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected');
      updateAssessmentResult();
    });
  });

  function updateAssessmentResult() {
    const selectedCount = document.querySelectorAll('.check-item.selected').length;
    
    if (selectedCount === 0) {
      resultText.textContent = "Selecione um ou mais sentimentos acima para uma reflexão de acolhimento personalizada.";
      resultActionBtn.href = generateWhatsAppLink("Olá, Thamires! Estava visitando o site Entre Nós Psicologia e gostaria de saber mais sobre como funciona o atendimento.");
      return;
    }

    let itemsTexts = [];
    document.querySelectorAll('.check-item.selected').forEach(selected => {
      itemsTexts.push(selected.querySelector('.check-text').textContent.trim());
    });

    if (selectedCount === 1) {
      resultText.innerHTML = `<strong>Acolhemos o que você está sentindo.</strong> Reconhecer esse momento é o primeiro passo de autocuidado. Você não precisa carregar isso sem apoio.`;
    } else {
      resultText.innerHTML = `<strong>Você identificou ${selectedCount} pontos importantes da sua rotina emocional.</strong> Muitas vezes tentamos dar conta de tudo sozinhas até o limite. Na terapia, encontramos um refúgio para respirar, organizar os pensamentos e recuperar a leveza.`;
    }

    const message = `Olá, Thamires! Estava navegando no site Entre Nós Psicologia e me identifiquei com alguns sentimentos: "${itemsTexts.slice(0, 2).join(' / ')}". Gostaria de conversar sobre iniciar a terapia.`;
    resultActionBtn.href = generateWhatsAppLink(message);
  }

  // =========================================================================
  // 5. MODAL DE AGENDAMENTO INTERATIVO
  // =========================================================================
  const modalOverlay = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalForm = document.getElementById('modalBookingForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Envio do Formulário Modal para WhatsApp
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const modality = document.getElementById('modalModality').value;
      const period = document.getElementById('modalPeriod').value;
      const note = document.getElementById('modalNote').value.trim();

      let text = `Olá, Thamires! Meu nome é *${name}*. `;
      text += `Gostaria de agendar uma primeira consulta no Entre Nós Psicologia.\n`;
      text += `• Modalidade preferida: *${modality}*\n`;
      text += `• Melhor período: *${period}*\n`;
      if (note) {
        text += `• O que busco na terapia: "${note}"\n`;
      }
      text += `Poderia me informar as opções de horários disponíveis?`;

      closeModal();
      window.open(generateWhatsAppLink(text), '_blank');
    });
  }

  // =========================================================================
  // 6. FORMULÁRIO PRINCIPAL DA SEÇÃO DE CONTATO
  // =========================================================================
  const mainContactForm = document.getElementById('mainContactForm');

  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const modality = document.getElementById('contactModality').value;
      const message = document.getElementById('contactMessage').value.trim();

      let text = `Olá, Thamires! Meu nome é *${name}*.\n`;
      if (email) text += `• E-mail: ${email}\n`;
      text += `• Preferência de Atendimento: *${modality}*\n`;
      if (message) text += `• Mensagem: "${message}"\n`;
      text += `Gostaria de agendar uma sessão com você no Entre Nós Psicologia.`;

      window.open(generateWhatsAppLink(text), '_blank');
    });
  }

  // Helper para gerar o link oficial do WhatsApp Web / App
  function generateWhatsAppLink(text) {
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${CLINIC_PHONE}?text=${encoded}`;
  }
});
